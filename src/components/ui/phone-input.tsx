"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const countries = [
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
];

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    { className, value = "", onChange, defaultCountry = "+44", ...props },
    ref
  ) => {
    const [countryCode, setCountryCode] = React.useState(defaultCountry);
    const [phoneNumber, setPhoneNumber] = React.useState("");

    React.useEffect(() => {
      // Parse initial value
      if (value) {
        const country = countries.find((c) => value.startsWith(c.code));
        if (country) {
          setCountryCode(country.code);
          setPhoneNumber(value.slice(country.code.length).trim());
        } else {
          setPhoneNumber(value);
        }
      }
    }, [value]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhone = e.target.value;
      setPhoneNumber(newPhone);
      onChange?.(`${countryCode} ${newPhone}`);
    };

    const handleCountryChange = (newCode: string) => {
      setCountryCode(newCode);
      onChange?.(`${newCode} ${phoneNumber}`);
    };

    return (
      <div className="flex items-center gap-2 w-full">
        <Select value={countryCode} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[100px] !h-12">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {countries.find((c) => c.code === countryCode)?.flag || "🏳️"}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-sm text-gray-500">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={cn("flex-1 h-12", className)}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
