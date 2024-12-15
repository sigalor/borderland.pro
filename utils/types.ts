export enum BurnStage {
  LotteryOpen = "lottery-open",
  LotteryClosed = "lottery-closed",
  OpenSale = "open-sale",
}

export enum BurnRole {
  Admin = "admin",
  Participant = "participant",
}

export enum BurnMembershipPricing {
  Tiered3 = "tiered-3",
}

export type BurnConfig = {
  id: string;
  current_stage: BurnStage;
  open_sale_starting_at: string;
  open_sale_reservation_duration: number;
  transfer_reservation_duration: number;
  last_possible_transfer_at: string;
  max_memberships: number;
  membership_price_currency: string;
  membership_pricing_type: BurnMembershipPricing;
  membership_price_tier_1: number;
  membership_price_tier_2: number;
  membership_price_tier_3: number;
  share_memberships_lottery: number;
  share_memberships_low_income: number;
  stripe_secret_api_key: string;
  stripe_webhook_secret: string;
};

export type BurnLotteryTicket = {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  is_low_income: boolean;
  is_winner: boolean;
  can_invite_plus_one: boolean;
};

export type BurnMembershipPurchaseRight = {
  id: string;
  created_at: string;
  expires_at: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  is_low_income: boolean;
  details_modifiable: boolean;
};

export type BurnMembership = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  price: number;
  price_currency: string;
  stripe_payment_intent_id?: string;
  checked_in_at?: string;
};

export type Project = {
  id: string;
  created_at: string;
  name: string;
  type: string;
  slug: string;
  roles: BurnRole[];
  burn_config: BurnConfig;
  lottery_ticket?: BurnLotteryTicket;
  membership_purchase_right?: BurnMembershipPurchaseRight;
  membership?: BurnMembership;
};

export type Profile = {
  id: string;
  registered_at: string;
  email: string;
  is_admin: boolean;
  projects: Project[];
};
