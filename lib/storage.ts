// Simple localStorage-based data management

export interface StorageItem {
  id: string
  createdAt: string
  updatedAt: string
  [key: string]: any
}

const STORAGE_PREFIX = "yarn_factory_"

export function getStorageKey(collection: string): string {
  return `${STORAGE_PREFIX}${collection}`
}

export function getAllItems(collection: string): StorageItem[] {
  try {
    const stored = localStorage.getItem(getStorageKey(collection))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getItemById(collection: string, id: string): StorageItem | null {
  const items = getAllItems(collection)
  return items.find((item) => item.id === id) || null
}

export function addItem(collection: string, data: Omit<StorageItem, "id" | "createdAt" | "updatedAt">): StorageItem {
  const items = getAllItems(collection)
  const newItem: StorageItem = {
    ...data,
    id: `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  items.push(newItem)
  localStorage.setItem(getStorageKey(collection), JSON.stringify(items))
  return newItem
}

export function updateItem(collection: string, id: string, data: Partial<StorageItem>): StorageItem | null {
  const items = getAllItems(collection)
  const index = items.findIndex((item) => item.id === id)
  
  if (index === -1) return null

  items[index] = {
    ...items[index],
    ...data,
    id: items[index].id,
    createdAt: items[index].createdAt,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(getStorageKey(collection), JSON.stringify(items))
  return items[index]
}

export function deleteItem(collection: string, id: string): boolean {
  const items = getAllItems(collection)
  const filtered = items.filter((item) => item.id !== id)
  
  if (filtered.length === items.length) return false

  localStorage.setItem(getStorageKey(collection), JSON.stringify(filtered))
  return true
}

export function clearCollection(collection: string): void {
  localStorage.removeItem(getStorageKey(collection))
}

// Seed initial data for demo
export function seedDemoData(): void {
  // Only seed if not already seeded
  if (getAllItems("managers").length > 0) return

  // Managers
  const managers = [
    { name: "John Smith", email: "john@factory.com", phone: "555-0101", status: "active" },
    { name: "Sarah Johnson", email: "sarah@factory.com", phone: "555-0102", status: "active" },
    { name: "Mike Davis", email: "mike@factory.com", phone: "555-0103", status: "active" },
  ]

  managers.forEach((m) => addItem("managers", m))

  // Machines
  const machines = [
    { name: "Machine A-1", type: "Spinning", capacity: "100kg/hr", status: "operational" },
    { name: "Machine A-2", type: "Spinning", capacity: "100kg/hr", status: "operational" },
    { name: "Machine B-1", type: "Twisting", capacity: "50kg/hr", status: "maintenance" },
  ]

  machines.forEach((m) => addItem("machines", m))

  // Yarn
  const yarns = [
    { name: "Cotton Yarn 20", type: "Cotton", count: "20", color: "White", quantity: "500" },
    { name: "Polyester Yarn 30", type: "Polyester", count: "30", color: "Black", quantity: "300" },
    { name: "Blend Yarn 40", type: "Blend", count: "40", color: "Gray", quantity: "200" },
  ]

  yarns.forEach((y) => addItem("yarn", y))

  // TPM
  const tpm = [
    { date: "2024-01-15", machine: "Machine A-1", type: "Preventive", status: "completed" },
    { date: "2024-01-20", machine: "Machine B-1", type: "Corrective", status: "in-progress" },
  ]

  tpm.forEach((item) => addItem("tpm", item))

  // Dyeing
  const dyeing = [
    { batchId: "DYE-001", yarnType: "Cotton", color: "Blue", quantity: "100kg", status: "completed" },
    { batchId: "DYE-002", yarnType: "Polyester", color: "Red", quantity: "50kg", status: "in-progress" },
  ]

  dyeing.forEach((item) => addItem("dyeing", item))

  // Conning
  const conning = [
    { batchId: "CON-001", yarnType: "Cotton", coneCount: "50", status: "completed" },
    { batchId: "CON-002", yarnType: "Polyester", coneCount: "30", status: "pending" },
  ]

  conning.forEach((item) => addItem("conning", item))

  // Packing
  const packing = [
    { batchId: "PAK-001", yarnType: "Cotton", weight: "100kg", packages: "20", status: "completed" },
    { batchId: "PAK-002", yarnType: "Polyester", weight: "50kg", packages: "10", status: "in-progress" },
  ]

  packing.forEach((item) => addItem("packing", item))

  // Stock
  const stock = [
    { itemCode: "STK-001", description: "Cotton Yarn 20", quantity: "500kg", location: "A1", status: "in-stock" },
    { itemCode: "STK-002", description: "Polyester Yarn 30", quantity: "300kg", location: "B2", status: "in-stock" },
    { itemCode: "STK-003", description: "Blend Yarn 40", quantity: "50kg", location: "A3", status: "low-stock" },
  ]

  stock.forEach((item) => addItem("stock", item))
}
