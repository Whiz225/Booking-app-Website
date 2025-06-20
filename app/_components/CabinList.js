import { unstable_noStore as noStore } from "next/cache";
import { getCabins } from "@/app/_lib/data-service";
import CabinCard from "@/app/_components/CabinCard";

async function CabinList({ filter }) {
  noStore();

  // const cabins = [];
  const cabins = await getCabins();
  if (!cabins.length) return null;

  let displayCabins;
  displayCabins = cabins;
  if (filter === "all") displayCabins = cabins;
  if (filter === "small")
    displayCabins = cabins.filter((cabin) => cabin.capacity <= 3);
  if (filter === "medium")
    displayCabins = cabins.filter(
      (cabin) => cabin.capacity >= 4 && cabin.capacity <= 7
    );
  if (filter === "large")
    displayCabins = cabins.filter((cabin) => cabin.capacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin._id} />
      ))}
    </div>
  );
}

export default CabinList;
