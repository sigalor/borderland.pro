export enum BurnStage {
  LotteryOpen = "lottery-open",
  LotteryClosed = "lottery-closed",
  OpenSale = "open-sale",
}

export enum BurnRole {
  Admin = "admin",
  Participant = "participant",
}

export type BurnConfig = {
  current_stage: BurnStage;
  max_memberships: number;
  open_sale_starting_at: string;
  open_sale_reservation_duration: number;
  transfer_reservation_duration: number;
};

export type BurnLotteryTicket = {
  id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  is_winner: boolean;
  can_invite_plus_one: boolean;
  added_to_waitlist_at: string;
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
};

export type Profile = {
  id: string;
  registered_at: string;
  email: string;
  is_admin: boolean;
  projects: Project[];
};
