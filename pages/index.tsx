import Search from "@/components/Search";
import Footer from "@/components/Footer";
import { Image } from "@nextui-org/react";

export default function Home() {
  return (
      <div className="flex flex-col items-center justify-center gap-2 p-10 min-h-screen">
        <div className="flex items-center justify-center gap-2">
          <Image src="https://rule34.xxx/images/logo.png" alt="logo" width={64} height={64} className="rounded-[12px]"/>
          <div>
            <h1 className="font-medium text-transparent bg-clip-text bg-gradient-to-tr from-green-400 to-white select-none">
              Rule 34
            </h1>
            <p>If it exists there is porn of it. If not, start uploading.</p>
          </div>
        </div>

        <Search />

        <Footer />
      </div>
  );
}
