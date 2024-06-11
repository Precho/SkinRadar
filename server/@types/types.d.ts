// types.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      API_KEY: string;
    }
  }

  interface SearchParams {
    per_page: string;
    page: string;
    search?: string;
    order?: string;
    sort?: string;
    auction?: string;
    price_min?: string;
    price_max?: string;
    wear_min?: string;
    wear_max?: string;
    has_stickers?: string;
    is_commodity?: string;
  }
}

export {};
