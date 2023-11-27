import prisma from "@/lib/prisma";

function generateSiteMap(products: {
    id: string;
    stripeId: string | null;
    name: string;
    image: string;
    altText: string;
    description: string;
    price: number;
}[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.kalind-ecommerce.com/</loc>
     </url>
     <url>
       <loc>https://www.kalind-ecommerce.com/cart</loc>
     </url>
     
     ${products
        .map(({id}) => {
          return `
        <url>
            <loc>https://plaex.net/product/${id}</loc>
        </url>
      `;
        })
        .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: {res: any}) {
  // We make an API call to gather the URLs for our site
  const products = await prisma.product.findMany();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(products);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
