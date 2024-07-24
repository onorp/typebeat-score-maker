export default function EditorInfo({
  time,
  endTime,
}: {
  time: number;
  endTime: number;
}) {
  return (
    <div
      className={
        "absolute bottom-4 left-4 w-72 h-16 flex justify-end items-end gap-4"
      }
    >
      <div
        className={
          "flex justify-center items-center w-full h-16 gap-2 bg-zinc-900/50 rounded-xl backdrop-blur-xl"
        }
      >
        <div className={"flex items-center justify-center w-full h-full"}>
          <div className={"flex items-end relative"}>
            <p className={"font-bold text-xl mr-16"}>
              {String(Math.floor(time / 60)).padStart(2, "0")} :{" "}
              {String(Math.floor(time % 60)).padStart(2, "0")}
            </p>
            <p className={"text-sm absolute w-max left-[54%]"}>
              /{" "}
              {Number.isNaN(endTime)
                ? "-- : --"
                : endTime <= 0
                  ? "-- : --"
                  : `${String(Math.floor(endTime / 60)).padStart(2, "0")} : ${String(Math.floor(endTime % 60)).padStart(2, "0")}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
