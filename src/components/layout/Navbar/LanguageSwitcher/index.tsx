'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/TranlateContext';
import { languageOptions } from '@/data/languageOptions';

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languageOptions.find((option) => option.code === lang) ||
    languageOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true">
        {/* <Image
          src={currentLanguage.flag}
          alt={`${currentLanguage.name} flag`}
          width={24}
          height={16}
          className="rounded-sm object-cover"
        /> */}
        <span className="font-medium">{currentLanguage.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full min-w-[120px] bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => {
                changeLang(option.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                option.code === lang ? 'bg-gray-50' : ''
              }`}>
              {/* <Image
                src={option.flag || '/placeholder.svg'}
                alt={`${option.name} flag`}
                width={24}
                height={16}
                className="rounded-sm object-cover"
              /> */}
              <span className="font-medium">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
