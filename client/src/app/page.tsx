import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-10 text-center flex-grow bg-black gap-10 pt-40">
      {/* <div className="flex flex-row gap-8 items-center justify-center bg-black">
        <h1 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-600 via-violet-500 to-pink-400 inline-block text-transparent bg-clip-text">
          Welcome to
        </h1>
        <div className="relative ">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-rose-400 via-indigo-500 to-indigo-500 opacity-75 blur"></div>

          <button className="relative rounded-lg bg-black px-7 py-4 text-white -ml-4">
            EditEz
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-black">
        <div className="absolute z-2 -mt-4">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-tr from-rose-400 via-indigo-500 to-indigo-500  opacity-75 blur"></div>
          <button className="relative rounded-lg bg-black px-7 py-4 text-white -mt-9">
            An LLM-backed editor
          </button>
        </div>
      </div> */}

      <div className="flex flex-row gap-8 items-center justify-center bg-black -rotate-[15deg]">
        <div className="relative ">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-[#000000] via-fuchsia-500 to-indigo-500 opacity-75 blur"></div>

          <button className="relative rounded-lg bg-black px-7 py-4 text-white -mt-9 -ml-4">
            Welcome to EditEz
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-black rotate-[13deg]">
        <div className="">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-[#000000] via-indigo-500 to-fuchsia-500  opacity-75 blur"></div>
          <button className="relative rounded-lg bg-black px-7 py-4 text-white -mb-9 -ml-4  ">
            An LLM-backed md editor
          </button>
        </div>
      </div>

      {/* <div className="flex flex-row gap-8 items-center justify-center bg-black -rotate-[105deg] -mt-20 absolute">
        <div className="absolute ">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-[#000000] via-fuchsia-500 to-indigo-500 opacity-75 blur"></div>

          <button className="relative rounded-lg bg-black px-7 py-4 -mt-9 -ml-4 text-transparent">
            Welcome to EditEz
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-black -rotate-[15deg]">
        <div className="">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-[#000000] via-indigo-500 to-fuchsia-500  opacity-75 blur"></div>
          <button className="relative rounded-lg bg-black px-7 py-4  text-transparent -mb-9 -ml-4  ">
            An LLM-backed md editor
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-8 items-center justify-center bg-black -rotate-[15deg]">
        <div className="relative ">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-[#000000] via-fuchsia-500 to-indigo-500 opacity-75 blur"></div>

          <button className="relative rounded-lg bg-black px-7 py-4 text-white -mt-9 -ml-4">
            Welcome to EditEz
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-black -rotate-[15deg]">
        <div className="">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-[#000000] via-indigo-500 to-fuchsia-500  opacity-75 blur"></div>
          <button className="relative rounded-lg bg-black px-7 py-4 text-white -mb-9 -ml-4  ">
            An LLM-backed md editor
          </button>
        </div>
      </div> */}

      <h1 className="text-lg font-bold md:text-xl bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 inline-block text-transparent bg-clip-text"></h1>

      <p className="text-base mt-4 md:text-lg text-[#909090] font-light font-mono">
        EditEz, an Innovative Editing app that is
        <br /> <u>innovative</u> and <u>easy to use</u>
      </p>
      <Link href="/register">
        <button className="mt-8 text-white  font-medium rounded-lg text-[16px] px-4 py-2 text-center bg-gradient-to-r from-[#090909] to-zinc-900 ">
          Begin
        </button>
      </Link>
    </main>
  );
}
