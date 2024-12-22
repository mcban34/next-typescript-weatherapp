import localFont from "next/font/local";
import { useState } from "react";
import FindLocation from "@/Components/FindLocation";
import SearchLocation from "@/Components/SearchLocation";
import Result from "../Components/Result";
import Loading from "@/Components/Loading";
import NoData from "@/Components/NoData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function Home() {

  const [activeTab, setActiveTab] = useState<string>("location")

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchWeatherData, setSearchWeatherData] = useState<any>([]);

  const [findWeatherData, setfindWeatherData] = useState<any>([]);

  const [loading, setLoading] = useState(false)

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] relative min-h-screen w-full text-white`}
    >
      <div
        className="absolute inset-0 bg-[url('/background4.jpg')] bg-cover bg-bottom bg-no-repeat"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative min-h-screen flex items-center">
        <div className="container mx-auto  min-h-[700px] overflow-y-auto rounded-lg backdrop-blur-md border border-white/30 p-5">
          <div className="inline-flex backdrop-blur-md bg-white/10 p-2 rounded-md border border-white/10 text-sm">
            <div
              onClick={() => setActiveTab('location')}
              className={`px-5 py-2 cursor-pointer`}
            >
              Konum Seç
            </div>
            <div
              onClick={() => setActiveTab('search')}
              className={`px-5 py-2 cursor-pointer border-l border-gray-500`}
            >
              Arama Yap
            </div>
          </div>
          <div className="mt-5">
            {
              activeTab == "location" ? (
                <>
                  <FindLocation
                    setfindWeatherData={setfindWeatherData}
                    setLoading={setLoading}
                  />
                  {
                    findWeatherData != "" ? (
                      loading ? (
                        <Loading />
                      ) : (
                        <Result
                          weatherData={findWeatherData}
                        />
                      )
                    ) : (
                      <NoData text={"Lütfen Seçim Yapınız..."} />
                    )
                  }
                </>
              ) : (
                <>
                  <SearchLocation
                    setSearchWeatherData={setSearchWeatherData}
                    searchWeatherData={searchWeatherData}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setLoading={setLoading}
                  />
                  {
                    searchWeatherData != "" ? (
                      loading ? (
                        <Loading />
                      ) : (
                        <Result
                          weatherData={searchWeatherData}
                        />
                      )
                    ) : (
                      <NoData text={"Lütfen Arama Yapınız..."} />
                    )
                  }
                </>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}