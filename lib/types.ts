export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  desc: string;
  price: number;
  img: string;
  images: string[];
  stock: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // For backward compatibility
  updatedAt?: string; // For backward compatibility
}

export interface Staff {
  id?: number;
  full_name?: string;
  first_name?: string;
  fullName?: string; // For backward compatibility
  firstName?: string; // For backward compatibility
  login: string;
}

export interface CartItem extends Product {
  quantity: number;
}
