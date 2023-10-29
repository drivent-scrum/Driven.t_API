import { Address } from '@prisma/client';
import { prisma } from '@/config';

async function update(enrollmentId: number, updatedAddress: UpdateAddressParams) {
  return prisma.address.update({
    where: { enrollmentId },
    data: updatedAddress,
  });
}

export type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type UpdateAddressParams = CreateAddressParams;

export const addressRepository = {
  update,
};
