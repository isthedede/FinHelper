// Utility functions for localStorage operations

export const saveData = (key, data) => {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error('Error saving data:', error)
    return false
  }
}

export const loadData = (key, defaultValue = null) => {
  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) {
      return defaultValue
    }
    return JSON.parse(serialized)
  } catch (error) {
    console.error('Error loading data:', error)
    return defaultValue
  }
}

export const clearAllData = () => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing data:', error)
    return false
  }
}

export const removeData = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing data:', error)
    return false
  }
}
