import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import { Image } from "@nextui-org/react";

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

export function AboutUsContent({ data }: Props) {
  console.log(data);
  return (
    <>
      <div className="container max-w-5xl px-4 mx-auto my-16">
        <h1 className="text-4xl font-bold text-center">{data?.title}</h1>
        <p className="text-center my-4">{data?.paragraphs}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-16">
          {data?.team.map((member: any) => (
            <div
              className="w-full flex flex-col text-center items-center justify-between h-full"
              key={member.name}
            >
              <div>
                <h2 className="text-xl font-bold mb-4">{member.name}</h2>
                <Image
                  src={urlForImage(member.image)?.src || ""}
                  alt={member.name}
                  height={300}
                  width={250}
                  className="m-auto object-cover"
                />
              </div>
              <div className="portableText mt-4">
                <PortableText value={member.bio} components={components} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
