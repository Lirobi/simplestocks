
export default function Dashboard() {
    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">
                <h1 className="text-3xl font-bold p-10 pb-4">News</h1>


            </div>
            <h2 className="text-xl font-bold p-10 pb-4">
                SimpleStocks is now available to the public!
            </h2>
            <p className="text-sm p-10 pb-4 pt-4">
                We are excited to announce that SimpleStocks is now available for free!
                <br />
                Many features are still under development, but we are working hard to make it a great experience for you.
            </p>
        </div>
    );
}