export type Message =
  | { id: string; mine: boolean; kind: "text"; text: string }
  | { id: string; mine: boolean; kind: "photo"; uri: string }
  | {
      id: string;
      mine: boolean;
      kind: "location";
      latitude: number;
      longitude: number;
      approximate: boolean;
    };
