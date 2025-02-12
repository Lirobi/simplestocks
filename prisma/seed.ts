import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.$transaction([
        prisma.auditLog.deleteMany(),
        prisma.notification.deleteMany(),
        prisma.setting.deleteMany(),
        prisma.report.deleteMany(),
        prisma.sale.deleteMany(),
        prisma.inventoryTransaction.deleteMany(),
        prisma.purchaseOrder.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany(),
        prisma.supplier.deleteMany(),
        prisma.user.deleteMany(),
        prisma.business.deleteMany(),
    ])

    // Create test business
    const business = await prisma.business.create({
        data: {
            name: "Test Company Ltd",
            address: "123 Test Street",
            city: "Test City",
            postalCode: "12345",
            country: "Test Country",
            taxId: "TEST123456789",
            subscriptionPlan: "Pro",
            subscriptionStart: new Date(),
            subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            paymentStatus: "Paid",
        },
    })

    // Create test user
    const testUser = await prisma.user.create({
        data: {
            email: "test@test.test",
            password: await hash("test", 10),
            firstName: "Test",
            lastName: "User",
            phone: "+1234567890",
            birthDate: new Date("1990-01-01"),
            role: "Admin",
            address: "456 User Street",
            city: "Test City",
            postalCode: "12345",
            country: "Test Country",
            businessId: business.id,
            lastLogin: new Date(),
        },
    })

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: "Electronics",
                description: "Electronic devices and accessories",
                businessId: business.id,
            },
        }),
        prisma.category.create({
            data: {
                name: "Office Supplies",
                description: "General office supplies",
                businessId: business.id,
            },
        }),
        prisma.category.create({
            data: {
                name: "Furniture",
                description: "Office furniture and accessories",
                businessId: business.id,
            },
        }),
        prisma.category.create({
            data: {
                name: "IT Equipment",
                description: "IT and network equipment",
                businessId: business.id,
            },
        }),
    ])

    // Create suppliers
    const suppliers = await Promise.all([
        prisma.supplier.create({
            data: {
                name: "Tech Suppliers Inc",
                contactName: "John Supplier",
                email: "john@techsuppliers.test",
                phone: "+1987654321",
                address: "789 Supplier Ave",
                city: "Supply City",
                postalCode: "54321",
                country: "Supply Country",
                paymentTerms: "Net 30",
                businessId: business.id,
            },
        }),
        prisma.supplier.create({
            data: {
                name: "Office Mart",
                contactName: "Jane Vendor",
                email: "jane@officemart.test",
                phone: "+1987654322",
                address: "321 Vendor Street",
                city: "Vendor City",
                postalCode: "54322",
                country: "Vendor Country",
                paymentTerms: "Net 45",
                businessId: business.id,
            },
        }),
    ])

    // Create products
    const products = await Promise.all([
        // Electronics Category
        prisma.product.create({
            data: {
                name: "Laptop Pro",
                description: "High-performance business laptop",
                sku: "LAP001",
                barcode: "123456789",
                unitPrice: 1299.99,
                costPrice: 999.99,
                quantity: 50,
                minStockLevel: 10,
                categoryId: categories[0].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Desktop Computer",
                description: "Powerful workstation",
                sku: "DSK001",
                barcode: "123456790",
                unitPrice: 899.99,
                costPrice: 699.99,
                quantity: 30,
                minStockLevel: 5,
                categoryId: categories[0].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse",
                sku: "MOU001",
                barcode: "123456791",
                unitPrice: 29.99,
                costPrice: 15.99,
                quantity: 100,
                minStockLevel: 20,
                categoryId: categories[0].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Wireless Keyboard",
                description: "Bluetooth keyboard",
                sku: "KEY001",
                barcode: "123456792",
                unitPrice: 49.99,
                costPrice: 25.99,
                quantity: 75,
                minStockLevel: 15,
                categoryId: categories[0].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Monitor 27\"",
                description: "4K LED Monitor",
                sku: "MON001",
                barcode: "123456793",
                unitPrice: 349.99,
                costPrice: 249.99,
                quantity: 40,
                minStockLevel: 8,
                categoryId: categories[0].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),

        // Office Supplies Category
        prisma.product.create({
            data: {
                name: "Paper Clips",
                description: "Standard paper clips box",
                sku: "PC001",
                barcode: "987654321",
                unitPrice: 2.99,
                costPrice: 1.50,
                quantity: 1000,
                minStockLevel: 200,
                categoryId: categories[1].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Printer Paper",
                description: "A4 printer paper ream",
                sku: "PAP001",
                barcode: "987654322",
                unitPrice: 4.99,
                costPrice: 2.99,
                quantity: 500,
                minStockLevel: 100,
                categoryId: categories[1].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Stapler",
                description: "Heavy-duty stapler",
                sku: "STP001",
                barcode: "987654323",
                unitPrice: 12.99,
                costPrice: 6.99,
                quantity: 150,
                minStockLevel: 30,
                categoryId: categories[1].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Sticky Notes",
                description: "Colorful sticky notes pack",
                sku: "STN001",
                barcode: "987654324",
                unitPrice: 3.99,
                costPrice: 1.99,
                quantity: 300,
                minStockLevel: 50,
                categoryId: categories[1].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Ballpoint Pens",
                description: "Pack of 12 blue pens",
                sku: "PEN001",
                barcode: "987654325",
                unitPrice: 5.99,
                costPrice: 2.99,
                quantity: 400,
                minStockLevel: 80,
                categoryId: categories[1].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),

        // Furniture Category
        prisma.product.create({
            data: {
                name: "Office Chair",
                description: "Ergonomic office chair",
                sku: "CHR001",
                barcode: "456789123",
                unitPrice: 199.99,
                costPrice: 129.99,
                quantity: 25,
                minStockLevel: 5,
                categoryId: categories[2].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Desk",
                description: "Standard office desk",
                sku: "DSK002",
                barcode: "456789124",
                unitPrice: 299.99,
                costPrice: 199.99,
                quantity: 20,
                minStockLevel: 4,
                categoryId: categories[2].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Filing Cabinet",
                description: "3-drawer filing cabinet",
                sku: "CAB001",
                barcode: "456789125",
                unitPrice: 149.99,
                costPrice: 89.99,
                quantity: 15,
                minStockLevel: 3,
                categoryId: categories[2].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Bookshelf",
                description: "5-shelf bookcase",
                sku: "SHF001",
                barcode: "456789126",
                unitPrice: 129.99,
                costPrice: 79.99,
                quantity: 18,
                minStockLevel: 4,
                categoryId: categories[2].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Meeting Table",
                description: "8-person conference table",
                sku: "TBL001",
                barcode: "456789127",
                unitPrice: 499.99,
                costPrice: 349.99,
                quantity: 10,
                minStockLevel: 2,
                categoryId: categories[2].id,
                supplierId: suppliers[1].id,
                businessId: business.id,
            },
        }),

        // IT Equipment Category
        prisma.product.create({
            data: {
                name: "Network Switch",
                description: "24-port gigabit switch",
                sku: "NSW001",
                barcode: "789123456",
                unitPrice: 199.99,
                costPrice: 149.99,
                quantity: 20,
                minStockLevel: 4,
                categoryId: categories[3].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Wireless Router",
                description: "Dual-band WiFi 6 router",
                sku: "RTR001",
                barcode: "789123457",
                unitPrice: 159.99,
                costPrice: 99.99,
                quantity: 25,
                minStockLevel: 5,
                categoryId: categories[3].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Network Cable",
                description: "Cat6 ethernet cable 50ft",
                sku: "CBL001",
                barcode: "789123458",
                unitPrice: 19.99,
                costPrice: 9.99,
                quantity: 100,
                minStockLevel: 20,
                categoryId: categories[3].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "UPS Battery Backup",
                description: "1500VA UPS system",
                sku: "UPS001",
                barcode: "789123459",
                unitPrice: 199.99,
                costPrice: 149.99,
                quantity: 15,
                minStockLevel: 3,
                categoryId: categories[3].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
        prisma.product.create({
            data: {
                name: "Server Rack",
                description: "42U server rack cabinet",
                sku: "RCK001",
                barcode: "789123460",
                unitPrice: 899.99,
                costPrice: 699.99,
                quantity: 5,
                minStockLevel: 1,
                categoryId: categories[3].id,
                supplierId: suppliers[0].id,
                businessId: business.id,
            },
        }),
    ])

    // Create purchase orders
    await prisma.purchaseOrder.create({
        data: {
            totalCost: 7999.90,
            status: "Received",
            notes: "Bulk laptop order",
            supplierId: suppliers[0].id,
            businessId: business.id,
            expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
    })

    // Create sales
    await prisma.sale.create({
        data: {
            quantitySold: 2,
            salePrice: 1999.98,
            customerName: "John Customer",
            paymentMethod: "Card",
            notes: "Laptop bulk purchase",
            productId: products[0].id,
            businessId: business.id,
            userId: testUser.id,
        },
    })

    // Create inventory transactions
    await prisma.inventoryTransaction.create({
        data: {
            type: "Purchase",
            quantity: 10,
            notes: "Initial stock",
            productId: products[0].id,
            businessId: business.id,
            userId: testUser.id,
        },
    })

    // Create settings
    await prisma.setting.create({
        data: {
            key: "Currency",
            value: "USD",
            businessId: business.id,
        },
    })

    // Create notifications
    await prisma.notification.create({
        data: {
            message: "Low stock alert for Laptops",
            type: "Reorder Alert",
            userId: testUser.id,
        },
    })

    // Create audit logs
    await prisma.auditLog.create({
        data: {
            action: "Initial Setup",
            details: "System initialization",
            userId: testUser.id,
            businessId: business.id,
        },
    })

    // Create reports
    await prisma.report.create({
        data: {
            type: "Inventory Report",
            data: JSON.stringify({ timestamp: new Date(), totalProducts: 2 }),
            businessId: business.id,
        },
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 