import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';
import { CreateAddressParams, UpdateAddressParams } from './address-repository';

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function updateWithAddress(
  userId: number,
  enrollmentId: number,
  updatedEnrollment: UpdateEnrollmentParams,
  updatedAddress: UpdateAddressParams
) {
  const updateEnrollment = prisma.enrollment.update({
    where: { userId },
    data: updatedEnrollment
  });

  const updateAddress = prisma.address.update({
    where: { enrollmentId },
    data: updatedAddress,
  });

  const [Enrollment] = await prisma.$transaction(
    [updateEnrollment, updateAddress]
  );
  return Enrollment;
}

async function update(userId: number, updatedEnrollment: UpdateEnrollmentParams) {
  return prisma.enrollment.update({
    where: { userId },
    data: updatedEnrollment
  });
}

async function createWithAddress(
  createdEnrollment: CreateEnrollmentParams,
  createdAddress: CreateAddressParams
) {
  return prisma.enrollment.create({
    data: {
      ...createdEnrollment,
      Address: {
        create: createdAddress
      }
    }
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

export const enrollmentRepository = {
  findWithAddressByUserId,
  update,
  createWithAddress,
  updateWithAddress
};
