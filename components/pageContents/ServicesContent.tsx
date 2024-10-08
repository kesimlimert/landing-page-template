"use client";
import { Image } from "@nextui-org/react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import { useNavbarStore } from "@/lib/store";
import { useEffect } from "react";

type Props = {
  data: any;
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full my-6">
          <Image
            className="object-cover mx-auto"
            src={urlForImage(value)?.src || ""}
            alt={value.alt || " "}
            height={urlForImage(value)?.height || ""}
            width={urlForImage(value)?.width || ""}
          />
        </div>
      );
    },
  },
};

export function ServicesContent({ data }: Props) {
  const { setActiveItem } = useNavbarStore();
  useEffect(() => {
    setActiveItem(data?.slug.current);
  }, [setActiveItem, data?.slug]);

  const getCategoryColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: 'bg-green-400',
      blue: 'bg-blue-400',
      purple: 'bg-purple-400',
      orange: 'bg-orange-400'
    };
    return colorMap[color] || 'bg-gray-200';
  };

  return (
    <>
      {data && (
        <div className="container max-w-5xl px-4 mx-auto my-16 portableText">
          <div className="flex justify-center items-center">
            <Image
              src={(urlForImage(data.mainImage)?.src || "")}
              alt={data.mainImage?.alt || ""}
              width={600}
              height={300}
              loading="eager"
              className="mb-10"
            />
          </div>
          <PortableText value={data.body} components={components} />
          <div className="flex mt-5 items-center">
            {data.categories.map((category: any) => (
              <div
                className={`${getCategoryColor(category.color)} opacity-80 rounded-full py-1 px-2`}
                key={category.slug}
              >
                <p className="text-xs text-white mt-2 font-bold">{category.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
