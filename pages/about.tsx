import MyLink from "@/components/MyLink";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const About = () => {
  const {theme} = useTheme();
  const images = [
    { src: "/images/technologies/next", alt: "next.js logo", link: "https://nextjs.org/" },
    {
      src: "/images/technologies/typescript",
      alt: "typescript logo",
      link: "https://www.typescriptlang.org/",
    },
    {
      src: "/images/technologies/tailwindcss",
      alt: "tailwindcss logo",
      link: "https://tailwindcss.com/",
    },
    {
      src: "/images/technologies/shadcnui",
      alt: "shadcn/ui logo",
      link: "https://ui.shadcn.com/",
    },
    {
      src: "/images/technologies/postgresql",
      alt: "PostgreSQL logo",
      link: "https://www.postgresql.org/",
    },
    {
      src: "/images/technologies/prisma",
      alt: "Prisma logo",
      link: "https://www.prisma.io/",
    },
    {
      src: "/images/technologies/stripe",
      alt: "Stripe logo",
      link: "https://stripe.com/",
    },
  ];

  return (
    <div className="flex flex-col items-center p-14 md:px-24 h-screen ">
      <Head>
        <title>About the website</title>
        <meta name="description" content="Learn more about this website" />
        <meta property="og:title" content="About the website" />
        <meta
          property="og:description"
          content="Learn more about this website"
        />
        <meta property="og:image" content="https://kalind-ecommerce.com/" />
        <meta
          property="og:image:secure"
          content="https://kalind-ecommerce.com/"
        />
        <meta property="og:url" content="https://kalind-ecommerce.com/about" />
        <meta name="keywords" content="about, web dev, ecommerce" />
        <link rel="canonical" href="https://kalind-ecommerce.com/about" />
      </Head>
      <section className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl">
            About this Webste
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4 text-justify w-full md:w-1/2">
            <p>
              This website is done as a side project to practice my Web
              Development skills. It was built using{" "}
              <MyLink href="https://nextjs.org/">Next.js</MyLink> with{" "}
              <MyLink href="https://www.typescriptlang.org/">TypeScript</MyLink>
              , <MyLink href="https://tailwindcss.com/">tailwindcss</MyLink> for
              styling, <MyLink href="https://ui.shadcn.com/">shadcn/ui</MyLink>{" "}
              for better styled components,{" "}
              <MyLink href="https://www.postgresql.org/">PostgreSQL</MyLink> for
              a database, <MyLink href="https://www.prisma.io/">Prisma</MyLink>{" "}
              as a database ORM, and{" "}
              <MyLink href="https://stripe.com/">Stripe</MyLink> for payments.
            </p>
            <p>
              You can view this project on my{" "}
              <MyLink href="https://github.com/KalinD/myEcommerce">
                GitHub
              </MyLink>
              . To get in contact with me go to my <MyLink href="https://www.linkedin.com/in/kalin-doychev/">LinkedIn</MyLink> page.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 md:grid md:grid-rows-3 md:grid-cols-5 md:gap-2 w-full md:w-1/2">
            {images.map((image) => (
              <>
                <div className="w-full h-full relative ">
                  <Link href={image.link} className="flex justify-center">
                    <Image
                      className="max-h-20 md:max-w-fit"
                      src={`${image.src}-${theme}.svg`}
                      alt={image.alt}
                      width={200}
                      height={200}
                    />
                  </Link>
                </div>
                <div></div>
              </>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
