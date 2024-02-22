import { Inter, Kanit, Lusitana } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });

export const kanit = Kanit({
  subsets: ['latin'],
  weight: ['200', '300', '700'],
});

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
  });