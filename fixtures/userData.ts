import { requireEnv } from "../utils/general";

type UserProps = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  province: string;
}

export const ADDRESS_USER_DATA: UserProps = {
  firstName: "John",
  lastName: "Doe",
  company: "Test Company s. r. o.",
  phone: "+1234567890",
  address: "123 Main St, Anytown, USA",
  address2: "Apt 1",
  city: "Anytown",
  state: "dk",
  zip: "12345",
  province: "Hovedstaden",
  country: "Denmark",
};

export const INVALID_LOGIN_CASES: Array<{
	name: string
	email: string
	password: string
}> = [
	{
		name: "email and password are invalid",
		email: "invalid-email@email.com",
		password: "invalid-password",
	},
	{
		name: "email is invalid",
		email: "invalid-email@email.com",
		password: requireEnv("PASSWORD"),
	},
	{
		name: "password is invalid",
		email: requireEnv("EMAIL"),
		password: "invalid-password",
	},
]
