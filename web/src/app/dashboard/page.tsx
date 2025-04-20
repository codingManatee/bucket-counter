import DayChart from "@/components/graph/dayChart";

const Page = () => {
    return (
        <>
            <div className="p-5">
                <div className="text-3xl font-extrabold pb-5">Dashboard</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="grid-cols-3 grid gap-4">
                        {/*<DailyCounter />*/}
                        {/*<DayCounter />*/}
                        {/*<NightCounter />*/}
                        {/*<IdleTable />*/}
                    </div>
                    <div className="grid-cols-3 h-full">
                        <DayChart/>
                        {/*<NightChart />*/}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
