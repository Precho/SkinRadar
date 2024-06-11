import "./App.css";

import React, { useEffect, useState } from "react";

// interface DepositorStats {
//     delivery_rate_recent: number;
//     delivery_rate_long: number;
//     delivery_time_minutes_recent: number;
//     delivery_time_minutes_long: number;
//     steam_level_min_range: number;
//     steam_level_max_range: number;
//     user_has_trade_notifications_enabled: boolean;
//     user_is_online: boolean | null;
// }

// interface AuctionItem {
//     auction_ends_at: number;
//     auction_highest_bid: number | null;
//     auction_highest_bidder: string | null;
//     auction_number_of_bids: number;
//     custom_price_percentage: number;
//     icon_url: string;
//     is_commodity: boolean;
//     market_name: string;
//     market_value: number;
//     name_color: string;
//     preview_id: string;
//     price_is_unreliable: boolean;
//     stickers: any[]; // Assuming stickers is an array of unknown objects
//     wear: number;
//     published_at: string;
//     id: number;
//     depositor_stats: DepositorStats;
//     above_recommended_price: number;
// }

// interface Data {
//     data: AuctionItem[];
// }
function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    console.log("fetchData executed-------");

    try {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result.lastResponse.data);

      setData(result.lastResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.toString());
    }
    console.log(data.lastResponse.data);
    console.log(data);

    console.log("useEffect executed-------");
  };

  useEffect(() => {
    console.log("useEffect executed");
    fetchData(); // Pobieranie danych na początku

    const intervalId = setInterval(fetchData, 50000); // Ustawienie interwału na pobieranie danych co minutę

    return () => clearInterval(intervalId); // Zwolnienie interwału po zakończeniu komponentu
  }, []); // Pusta tablica zależności, aby useEffect działał tylko raz przy pierwszym renderowaniu

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const { lastResponse, lastRequestTime, nextRequestTime } = data;

  return (
    <div className="App">
      <header className="App-header">
        <h1>CS2 Skin Price Comparison</h1>
        <div id="content">
          <h2>Last API Response:</h2>
          {/* <pre id="response">{JSON.stringify(lastResponse, null, 2)}</pre> */}
          {/* {data.map((x) => {
            return <h3>x.id</h3>;
          })} */}
          <h2>Last Request Time:</h2>
          <p id="lastRequestTime">
            {lastRequestTime
              ? new Date(lastRequestTime).toLocaleString()
              : "No request made yet"}
          </p>
          <h2>Next Request In:</h2>
          <p id="timer">
            {nextRequestTime
              ? new Date(nextRequestTime).toLocaleString()
              : "No next request time"}
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
