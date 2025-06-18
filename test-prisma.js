// Simple test script to check if Prisma client works
import { prisma } from './src/lib/prisma.js';

async function main() {
  try {
    console.log('Testing Prisma client connection...');
    
    // Just retrieve a simple count of users to test the connection
    const userCount = await prisma.user.count();
    console.log(`Connection successful! User count: ${userCount}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error testing Prisma client:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(result => console.log(result))
  .catch(e => console.error(e));
