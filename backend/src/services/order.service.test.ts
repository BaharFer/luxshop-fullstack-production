import { prisma } from '../db/prisma';
import { createOrder } from './order.service';

const input = (productId:string) => ({ customerName:'Concurrency Test', customerPhone:'09000000000', items:[{productId,quantity:1}], shippingMethod:'express', couponCode:undefined, address:{fullName:'Concurrency Test',phone:'09000000000',province:'تهران',city:'تهران',postalCode:'1111111111',street:'Test'}, paymentMethod:'saman' });

async function main(){
  const product=await prisma.product.findFirst({where:{isActive:true}}); if(!product) throw new Error('No active product');
  await prisma.product.update({where:{id:product.id},data:{stock:1}});
  const [a,b]=await Promise.allSettled([createOrder(input(product.id)),createOrder(input(product.id))]);
  const successes=[a,b].filter(x=>x.status==='fulfilled');
  const after=await prisma.product.findUnique({where:{id:product.id}});
  if(successes.length!==1 || after?.stock!==0) throw new Error(`Concurrency invariant failed: successes=${successes.length}, stock=${after?.stock}`);
  console.log('PASS: only one concurrent purchase succeeded and stock reached 0.');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>prisma.$disconnect());
