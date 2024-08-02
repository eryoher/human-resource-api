import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import { EmployeeModel } from "../models/Employee.js";
import { connectToDatabase } from "../config/database.js";
import formatEmployee from "../utils/format.js";

const db = connectToDatabase();
const employeeModel = new EmployeeModel(db);

const EmployeeType = new GraphQLObjectType({
  name: "Employee",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    address: { type: GraphQLString },
    phone: { type: GraphQLString },
    departmentId: { type: GraphQLInt },
    active: { type: GraphQLBoolean },
    avatar: { type: GraphQLString },
    hireDate: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve: async () => {
        try {
          const employees = await employeeModel.getAllEmployees();
          return formatEmployee(employees);
        } catch (error) {
          throw new Error(`Failed to fetch employees: ${error.message}`);
        }
      },
    },
    employee: {
      type: EmployeeType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        try {
          const employee = await employeeModel.getEmployeeById(id);
          return formatEmployee(employee);
        } catch (error) {
          throw new Error(
            `Failed to fetch employee with id ${id}: ${error.message}`
          );
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addEmployee: {
      type: EmployeeType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        departmentId: { type: new GraphQLNonNull(GraphQLInt) },
        active: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(_, args) {
        return employeeModel.createEmployee(args);
      },
    },
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        address: { type: GraphQLString },
        phone: { type: GraphQLString },
        departmentId: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
      },
      resolve(_, args) {
        return employeeModel.updateEmployee(args);
      },
    },
    deleteEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        return employeeModel.deleteEmployeeById(args.id);
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
