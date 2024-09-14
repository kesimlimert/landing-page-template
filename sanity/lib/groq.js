import { groq } from "next-sanity";

// Get all posts
export const postquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
  _id,
  _createdAt,
  publishedAt,
  mainImage {
    ...,
    "blurDataURL":asset->metadata.lqip,
    "ImageColor": asset->metadata.palette.dominant.background,
  },
  featured,
  excerpt,
  slug,
  title,
  author-> {
    _id,
    image,
    slug,
    name
  },
  categories[]->,
}
`;
// Get all posts with 0..limit
export const limitquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [0..$limit] {
  ...,
  author->,
  categories[]->
}
`;
// [(($pageIndex - 1) * 10)...$pageIndex * 10]{
// Get subsequent paginated posts
export const paginatedquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->
}
`;

// Get Site Config
export const configQuery = groq`
*[_type == "settings"][0] {
  ...,
}
`;

// Single Post
export const singlequery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ...,
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  author->,
  categories[]->,
  "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "related": *[_type == "post" && count(categories[@._ref in ^.^.categories[]._ref]) > 0 ] | order(publishedAt desc, _createdAt desc) [0...5] {
    title,
    slug,
    "date": coalesce(publishedAt,_createdAt),
    "image": mainImage
  },
}
`;

// Paths for generateStaticParams
export const pathquery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;
export const servicesnavquery = groq`
*[_type == "post" && defined(slug.current) && showInMenu == true]{
  "slug": slug.current,
  "title": title
}
`;
export const catpathquery = groq`
*[_type == "category" && defined(slug.current)][].slug.current
`;
export const authorsquery = groq`
*[_type == "author" && defined(slug.current)][].slug.current
`;

// Get Posts by Authors
export const postsbyauthorquery = groq`
*[_type == "post" && $slug match author->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get Posts by Category
export const postsbycatquery = groq`
*[_type == "post" && $slug in categories[]->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get top 5 categories
export const catquery = groq`*[_type == "category"] {
  ...,
  "count": count(*[_type == "post" && references(^._id)])
} | order(count desc) [0...5]`;

export const searchquery = groq`*[_type == "post" && _score > 0]
| score(title match $query || excerpt match $query || pt::text(body) match $query)
| order(_score desc)
{
  _score,
  _id,
  _createdAt,
  mainImage,
  author->,
  categories[]->,
   title,
   slug
}`;

// Get all Authors
export const allauthorsquery = groq`
*[_type == "author"] {
 ...,
 'slug': slug.current,
}
`;

// Get page title and slug from navbar
export const navbarmenuquery = groq`
*[_type == "navbar"][0] {
  title,
  hideDropdown,
  "pageReferences": pageReferences[]->{
    title,
    "slug": slug.current
  }
}
`;

// Home Page

export const homepagequery = groq`
*[_type == "homePage"][0] {
  ...,
  content[] {
    ...,
    _type == "reference" => @->{
      title,
      "slug": slug.current
    },
    _type == "textImage" => {
      ...,
      button {
        buttonText,
        buttonLink->{
          title,
          "slug": slug.current
        }
      }
    },
    _type == "brandsList" => {
      ...,
      brandImages[]->{
        _id,
        _type,
        image,
        alt
      }
    },
    _type == "videoReferences" => @->{
      _id,
      displayContentTextBlock,
      contentTextBlock,
      videoSource,
      title,
      description,
    },
     _type == "testimonialList" => {
      ...,
      testimonialReferences[]-> {
        _id,
        title,
        comment,
        authorName,
        authorJobTitle,
      },
    },
    _type == "faqList" => {
      ...,
      faqReferences[]-> {
        _id,
        title,
        question,
        answer
      }
    },
  }
}
`;


// get everything from sanity
// to test connection
export const getAll = groq`*[]`;
