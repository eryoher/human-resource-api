import z from "zod";

const employeeSchema = z.object({
  firstName: z.string({
    invalid_type_error: "first name must be a string",
    required_error: "first name is required.",
  }),
  lastName: z.string({
    invalid_type_error: "lastName must be a string",
    required_error: "lastName is required.",
  }),
  address: z.string({
    invalid_type_error: "address must be a string",
    required_error: "address is required.",
  }),
  phone: z
    .string({
      required_error: "Phone is required.",
    })
    .min(10, { message: "The phone is too short" }),
  departmentId: z.number().int().positive(),
  active: z.boolean(),
});

export function validateEmployee(input) {
  return employeeSchema.safeParse(input);
}
