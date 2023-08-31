# Kalin's E-Commerce Website

## Link
The website is hosted at: https://kalind-ecommerce.com/

## Description 
I decided to do this project to improve my skills in web development. I used [Next.js](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/), [tailwindcss](https://tailwindcss.com/) for styling, [shadcn/ui](https://ui.shadcn.com/) for better styled components, [Prisma](https://www.prisma.io/) as a database ORM, and [Stripe](https://stripe.com/) for payments. I chose this stack as I wanted to switch from JavaScript to TypeScript, and I wanted to improve my React.js/Next.js skills.

![Image of the home page on Desktop](./github-images/desktop%20-%20home%20page.png)
![Image of the cart page on Desktop](./github-images/desktop%20-%20cart.png)

# Setup
To run the project locally, first, you must install the necessary dependencies.

```sh
npm install
```

Then the tables must be created in the database.
```sh 
npx prisma db push
```

For that to work the correct parameters need to be set in the *.env* file. An example can be seen in [.env.example](https://github.com/KalinD/myEcommerce).

Finally, the project can be ran in dev mode
```sh
npm run dev
```
or in build mode
```sh
npm run build
npm run start
```

# Status
myEcommerce is overall done for now. I might go back to it in the future for small improvements.

# License
MIT license @ (KalinD)[https://github.com/KalinD]
