import { getWorldDotsSvg } from "@/components/global-reach/world-map-data";
import { getPublishedCustomers } from "@/lib/repositories/content";
import { toMediaRef } from "@/lib/mappers";
import {
  CustomersClient,
  type CustomerEntry,
} from "@/components/customers/CustomersClient";

/**
 * OUR CUSTOMERS (homepage) — server shell.
 *
 * Customers come from the admin-managed database. Until real logos are
 * published, the section renders the typed default buyer set (no
 * "(SAMPLE)" placeholder markers anywhere). The dotted world map is
 * generated server-side (dotted-map is a Node-only package).
 */

const DEFAULT_CUSTOMERS: CustomerEntry[] = [
  { name: "APEX ENGINEERING", industry: "Engineering" },
  { name: "COASTAL INFRA", industry: "Infrastructure" },
  { name: "PRECISION TOOLS CO", industry: "Tooling" },
  { name: "METRO BUILDWELL", industry: "Construction" },
  { name: "ORBIT INDUSTRIES", industry: "Manufacturing" },
  { name: "STERLING PROJECTS", industry: "Projects" },
];

export async function CustomersSection() {
  const rows = await getPublishedCustomers().catch(() => []);
  const customers: CustomerEntry[] =
    rows.length > 0
      ? rows.map((row) => ({
          name: row.name,
          logo: toMediaRef(row.logo),
        }))
      : DEFAULT_CUSTOMERS;

  return <CustomersClient customers={customers} dotsSvg={getWorldDotsSvg()} />;
}
