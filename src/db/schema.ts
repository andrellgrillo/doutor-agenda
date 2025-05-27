import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const userTableRelations = relations(userTable, ({ many }) => ({
  userToClinics: many(userToClinicTable),
}));

export const clinicTable = pgTable("clinics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userToClinicTable = pgTable("user_to_clinic", {
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userToClinicTableRelations = relations(
  userToClinicTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [userToClinicTable.userId],
      references: [userTable.id],
    }),
    clinic: one(clinicTable, {
      fields: [userToClinicTable.clinicId],
      references: [clinicTable.id],
    }),
  }),
);

export const clinicTableRelations = relations(clinicTable, ({ many }) => ({
  doctors: many(doctorTable),
  patients: many(patientTable),
  appointments: many(appointmentTable),
  usersToClinics: many(userToClinicTable),
}));

export const doctorTable = pgTable("doctors", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  availableFromWeekday: integer("available_from_weekday").notNull(), // 1 - 7 (Monday - Sunday)
  availableToWeekday: integer("available_to_weekday").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  speciality: text("speciality").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorTableRelations = relations(doctorTable, ({ many, one }) => ({
  clinic: one(clinicTable, {
    fields: [doctorTable.clinicId],
    references: [clinicTable.id],
  }),
  appointments: many(appointmentTable),
}));

export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientTable = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientTableRelations = relations(
  patientTable,
  ({ many, one }) => ({
    clinic: one(clinicTable, {
      fields: [patientTable.clinicId],
      references: [clinicTable.id],
    }),
    appointments: many(appointmentTable),
  }),
);

export const appointmentTable = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentTableRelations = relations(
  appointmentTable,
  ({ one }) => ({
    patient: one(patientTable, {
      fields: [appointmentTable.patientId],
      references: [patientTable.id],
    }),
    doctor: one(doctorTable, {
      fields: [appointmentTable.doctorId],
      references: [doctorTable.id],
    }),
    clinic: one(clinicTable, {
      fields: [appointmentTable.clinicId],
      references: [clinicTable.id],
    }),
  }),
);
