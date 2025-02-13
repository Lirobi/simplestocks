import { PrismaClient } from "@prisma/client";

// Define model processing order to maintain referential integrity
const MODEL_PROCESSING_ORDER = [
    'Business',
    'Category',
    'Supplier',
    'Product',
    'User',
    'PurchaseOrder',
    'InventoryTransaction',
    'Sale',
    'Report',
    'Notification',
    'Setting',
    'AuditLog'
] as const;

export default async function cloneProd() {
    // Initialize production connection
    const prodDatabaseUrl = process.env.PRODUCTION_DATABASE_URL;
    if (!prodDatabaseUrl) throw new Error('PRODUCTION_DATABASE_URL is not set');
    const prisma = new PrismaClient({ datasources: { db: { url: prodDatabaseUrl } } });

    // Initialize local connection
    const localDatabaseUrl = process.env.DATABASE_URL;
    if (!localDatabaseUrl) throw new Error('DATABASE_URL is not set');
    const localPrisma = new PrismaClient({ datasources: { db: { url: localDatabaseUrl } } });

    try {
        for (const model of MODEL_PROCESSING_ORDER) {
            console.log(`Transferring ${model}...`);

            // Fetch data from production
            const records = await (prisma[model.toLowerCase() as keyof typeof prisma] as any).findMany();
            if (records.length === 0) continue;

            // Insert into local database
            await (localPrisma[model.toLowerCase() as keyof typeof prisma] as any).createMany({
                data: records.map(record => ({
                    ...record,
                    // Handle DateTime conversion if needed
                    createdAt: new Date(record.createdAt),
                    updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,
                })),
                skipDuplicates: true,
            });

            // Reset sequence for PostgreSQL auto-increment
            if (process.env.DB_TYPE === 'postgresql') {
                await localPrisma.$executeRawUnsafe(
                    `SELECT setval(pg_get_serial_sequence('"${model}"', 'id'), COALESCE(MAX(id), 1)) FROM "${model}";`
                );
            }
        }

        console.log('Database cloning completed successfully!');
    } catch (error) {
        console.error('Error during database cloning:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await localPrisma.$disconnect();
    }
}