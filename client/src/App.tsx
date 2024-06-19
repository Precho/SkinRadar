import "./App.css";

import React, { useEffect, useState } from "react";

interface DepositorStats {
  delivery_rate_recent: number;
  delivery_rate_long: number;
  delivery_time_minutes_recent: number;
  delivery_time_minutes_long: number;
  steam_level_min_range: number;
  steam_level_max_range: number;
  user_has_trade_notifications_enabled: boolean;
  user_is_online: boolean | null;
}

interface AuctionItem {
  auction_ends_at: number;
  auction_highest_bid: number | null;
  auction_highest_bidder: string | null;
  auction_number_of_bids: number;
  custom_price_percentage: number;
  icon_url: string;
  is_commodity: boolean;
  market_name: string;
  market_value: number;
  name_color: string;
  preview_id: string;
  price_is_unreliable: boolean;
  // Assuming stickers is an array of unknown objects
  stickers: any[];
  wear: number;
  published_at: string;
  id: number;
  depositor_stats: DepositorStats;
  above_recommended_price: number;
  suggested_price: number;
}

interface Data {
  lastResponse: {
    data: AuctionItem[];
  };
  lastRequestTime: number | null;
  nextRequestTime: number | null;
}

function App() {
  const [data, setData] = useState<Data | null>(null);
  const [auctionsData, setAuctionsData] = useState<AuctionItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    console.log("fetchData executed-------");

    try {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: Data = await response.json();
      console.log(result.lastResponse.data);

      setAuctionsData(result.lastResponse.data);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("error");
    }
  };

  useEffect(() => {
    console.log("useEffect executed");
    fetchData();

    const intervalId = setInterval(fetchData, 50000); 

    return () => clearInterval(intervalId); 
  }, []); 

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  if (!auctionsData) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const { lastRequestTime, nextRequestTime } = data as Data;

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h2>CS2 Skin Price Comparison</h2>
        <h3>Last Request Time:</h3>
        <p id="lastRequestTime">
          {lastRequestTime
            ? new Date(lastRequestTime).toLocaleString()
            : "No request made yet"}
        </p>
        <h3>Next Request In:</h3>
        <p id="timer">
          {nextRequestTime
            ? new Date(nextRequestTime).toLocaleString()
            : "No next request time"}
        </p>
      </header>
      <div style={styles.content}>
        <h2>Last API Response:</h2>
        {auctionsData.map((item) => (
          <ItemComponent auctionData={item} />
        ))}
      </div>
    </div>
  );
}
type Props = {
  readonly auctionData: AuctionItem;
};

const ItemComponent = (props: Props) => {
  const { auctionData } = props;
  const coinRatio = 0.6142808;

  const handleButtonClick = (itemID: number) => {
    window.open(`https://csgoempire.com/item/${itemID}`, "_blank");
  };

  const formatPrice = (price: number, toFixed: number = 1) => {
    return ((price * coinRatio) / 100).toFixed(toFixed) + ` $`;
  };

  return (
    <div key={auctionData.id} style={styles.itemContainer}>
      <h3 style={styles.itemTitle}>{auctionData.market_name}</h3>
      <p style={styles.market_value}>
        Market Value: {formatPrice(auctionData.market_value)}
      </p>
      <p style={styles.market_value}>
        Suggested Price: {formatPrice(auctionData.suggested_price)}
      </p>

      <p style={styles.above_recommended_price}>
        Above recomender price: {auctionData.above_recommended_price} $
      </p>

      <img
        src={`https://community.cloudflare.steamstatic.com/economy/image/${auctionData.icon_url}`}
        alt={auctionData.market_name}
        style={styles.itemImage}
      />
      <button
        style={styles.button}
        onClick={() => handleButtonClick(auctionData.id)}
      >
        Open
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#282c34",
    padding: "20px",
    color: "white",
  },
  content: {
    padding: "20px",
  },
  itemContainer: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "20px",
    display: "inline-block",
    maxWidth: "300px",
  },
  itemTitle: {
    fontSize: "18px",
    color: "#333",
    margin: "10px 0",
  },
  itemPrice: {
    color: "#555",
    margin: "5px 0",
  },
  itemImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "4px",
  },
  error: {
    color: "red",
  },
  loading: {
    color: "#888",
  },
};

export default App;
