import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeLink?: string;
}

const CustomBreadCrumb = ({ items, homeLink = '/' }: BreadcrumbProps) => {
  return (
    <div className="pb-[34px] pt-[44px]">
      <div className="wrapper">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={homeLink}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>

            {items.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  {item.href && index < items.length - 1 ? (
                    <BreadcrumbLink
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors">
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-gray-900 font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default CustomBreadCrumb;
