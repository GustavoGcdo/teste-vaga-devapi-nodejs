export interface UpdateConnectorDto {
  id: string;
  name?: string;
  type?: string;
  privacy?: string;
  baseURL?: string;
  category?: string;
  description?: string;
  status?: boolean;
}
