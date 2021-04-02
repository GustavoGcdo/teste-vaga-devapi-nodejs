export interface CreateConnectorDto {
  name: string;
  type: string;
  privacy: string;
  baseURL: string;
  category: string;
  description: string;
  status: boolean;
}
