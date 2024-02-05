-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "addressCity" TEXT,
    "addressCountry" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "addressPostalCode" TEXT,
    "addressState" TEXT,
    "metadata" JSONB,
    "shippingAddressCity" TEXT,
    "shippingAddressCountry" TEXT,
    "shippingAddressLine1" TEXT,
    "shippingAddressLine2" TEXT,
    "shippingAddressPostalCode" TEXT,
    "shippingAddressState" TEXT,
    "shippingName" TEXT NOT NULL,
    "shippingPhone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
