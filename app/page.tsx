'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  ChevronDown, 
  Search, 
  XCircle, 
  UserRoundCog, 
  ShoppingBasket, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  X, 
  Share2, 
  Eye, 
  LogOut, 
  Users, 
  Tags, 
  PackageOpen, 
  Save, 
  CloudUpload, 
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Product, Staff, CartItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Constants
const WHATSAPP_NUMBER = "5521987537876";
const LOJA_NOME = "Force Moto Peças";
const STAFF_PASS = "929130ab&";
const MASTER_CRED = { user: "andre", pass: "929130ab#" };

const generateId = () => Date.now();

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 1, 
    category: 'Motor', 
    name: 'Kit Relação DID Gold', 
    desc: 'Corrente 520x118, coroa 43T e pinhão 15T. Aço 1045 tratamento térmico.', 
    price: 385.00, 
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&q=80&w=800'
    ],
    code: 'KRD001',
    stock: true
  },
  { 
    id: 2, 
    category: 'Acessórios', 
    name: 'Capa de Banco Térmica', 
    desc: 'Proteção UV e impermeável. Universal para motos naked.', 
    price: 45.00, 
    img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800'
    ],
    code: 'CAP001',
    stock: true
  },
  { 
    id: 3, 
    category: 'Freios', 
    name: 'Pastilha de Freio Dianteira', 
    desc: 'Cerâmica de alta performance. Compatível: CB 300, XRE 300.', 
    price: 89.90, 
    img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800'
    ],
    code: 'PST001',
    stock: true
  }
];

const INITIAL_CATEGORIES = ['Motor', 'Acessórios', 'Freios', 'Suspensão', 'Elétrica', 'Pneus'];

export default function PortfolioPage() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentFilter, setCurrentFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'error' } | null>(null);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'loading'>('loading');

  // Admin Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [uploadTab, setUploadTab] = useState<'file' | 'link'>('file');
  const [linkInput, setLinkInput] = useState('');

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setDbStatus('loading');
      try {
        // Check if keys are placeholders
        if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
          setDbStatus('error');
          setProducts(INITIAL_PRODUCTS);
          setCategories(INITIAL_CATEGORIES);
          return;
        }

        // Fetch Products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (productsError) throw productsError;
        if (productsData && productsData.length > 0) {
          setProducts(productsData);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }

        // Fetch Categories
        const { data: catsData, error: catsError } = await supabase
          .from('categories')
          .select('name');
        
        if (catsError) throw catsError;
        if (catsData && catsData.length > 0) {
          setCategories(catsData.map(c => c.name));
        } else {
          setCategories(INITIAL_CATEGORIES);
        }

        // Fetch Staff
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*');
        
        if (staffError) throw staffError;
        setStaff(staffData || []);

        setDbStatus('connected');
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        setDbStatus('error');
        // Fallback to initial data if Supabase fails
        setProducts(INITIAL_PRODUCTS);
        setCategories(INITIAL_CATEGORIES);
      }
    };

    fetchData();
  }, []);

  // Utils
  const showToast = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Auth
  const handleLogin = () => {
    if (isAdmin) {
      const element = document.getElementById('admin-panel');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setIsLoginModalOpen(true);
  };

  const executeLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let auth = false;
    if (loginUser.toLowerCase() === MASTER_CRED.user && loginPass === MASTER_CRED.pass) {
      auth = true;
      setCurrentUser("André");
    } else {
      const s = staff.find(x => x.login === loginUser.toLowerCase() && loginPass === STAFF_PASS);
      if (s) {
        auth = true;
        setCurrentUser(s.first_name || s.firstName || 'Colaborador');
      }
    }

    if (auth) {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      setLoginUser('');
      setLoginPass('');
      showToast('Bem-vindo!', `Login realizado como ${currentUser || 'Admin'}`);
      setTimeout(() => {
        const element = document.getElementById('admin-panel');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      showToast('Acesso Negado', 'Usuário ou senha incorretos', 'error');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser('');
    setEditingId(null);
    showToast('Logout', 'Você saiu do painel administrativo');
  };

  // Cart Logic
  const addToCart = (product: Product) => {
    if (!product.stock) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast('Adicionado!', `${product.name} foi adicionado ao pedido`);
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Product Management
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formCat) {
      showToast('Erro', 'Preencha os campos obrigatórios', 'error');
      return;
    }

    const images = formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400'];

    try {
      if (editingId) {
        const updatedProduct = {
          name: formName,
          price: parseFloat(formPrice),
          category: formCat,
          desc: formDesc || 'Produto disponível para pronta entrega.',
          img: images[0],
          images: images,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('products')
          .update(updatedProduct)
          .eq('id', editingId);

        if (error) throw error;

        setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...updatedProduct } : p));
        setEditingId(null);
        showToast('Sucesso', 'Produto atualizado!');
      } else {
        const newProduct = {
          code: `PRD${String(products.length + 1).padStart(3, '0')}`,
          name: formName,
          price: parseFloat(formPrice),
          category: formCat,
          desc: formDesc || 'Produto disponível para pronta entrega.',
          img: images[0],
          images: images,
          stock: true,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('products')
          .insert([newProduct])
          .select();

        if (error) throw error;

        if (data) {
          setProducts(prev => [data[0], ...prev]);
        }
        showToast('Sucesso', 'Produto cadastrado!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Erro', 'Não foi possível salvar o produto', 'error');
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormPrice('');
    setFormCat('');
    setFormDesc('');
    setFormImages([]);
    setEditingId(null);
  };

  const editProduct = (p: Product) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormPrice(p.price.toString());
    setFormCat(p.category);
    setFormDesc(p.desc);
    setFormImages(p.images || [p.img]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id: number) => {
    if (confirm('Excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Excluído', 'Produto removido');
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Erro', 'Não foi possível excluir o produto', 'error');
      }
    }
  };

  const toggleStock = async (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: !product.stock })
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
    } catch (error) {
      console.error('Error toggling stock:', error);
      showToast('Erro', 'Não foi possível atualizar o estoque', 'error');
    }
  };

  const importInitialData = async () => {
    if (!confirm('Deseja importar os dados iniciais para o banco de dados?')) return;
    
    try {
      setDbStatus('loading');
      
      // Import Categories
      const { error: catError } = await supabase
        .from('categories')
        .insert(INITIAL_CATEGORIES.map(name => ({ name })));
      
      // Import Products (without IDs to let Supabase generate them)
      const productsToImport = INITIAL_PRODUCTS.map(({ id, ...p }) => ({
        ...p,
        created_at: new Date().toISOString()
      }));
      
      const { error: prodError } = await supabase
        .from('products')
        .insert(productsToImport);

      if (catError || prodError) throw new Error('Erro na importação');

      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível importar os dados', 'error');
      setDbStatus('error');
    }
  };

  // WhatsApp
  const sendOrder = () => {
    if (cart.length === 0) return;
    const extra = (document.getElementById('checkout-extra') as HTMLSelectElement)?.value || 'Retirada';
    const notes = (document.getElementById('order-notes') as HTMLTextAreaElement)?.value || '';
    
    let message = `*🏍️ NOVO PEDIDO - ${LOJA_NOME}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    cart.forEach(item => { 
      message += `📦 *${item.quantity}x* ${item.name}\n`;
      message += `   Código: ${item.code || 'N/A'} | ${formatCurrency(item.price * item.quantity)}\n\n`;
    });
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📍 *Entrega:* ${extra}\n`;
    if (notes) message += `📝 *Obs:* ${notes}\n`;
    message += `💰 *Total:* ${formatCurrency(cartTotal)}\n\n`;
    message += `⏰ _Pedido gerado em ${new Date().toLocaleString('pt-BR')}_`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareProduct = (p: Product) => {
    const message = `*${p.name}*\n💰 *Preço:* ${formatCurrency(p.price)}\n📦 *Cat:* ${p.category}\n📝 ${p.desc}\n\n_Force Moto Peças_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = currentFilter === 'Todos' || p.category === currentFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section id="home" className="hero-gradient min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-darkness/50 to-darkness" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto w-full"
        >
          <div className="inline-flex items-center gap-2 bg-racing/20 border border-racing/50 text-racing text-xs font-black px-4 py-2 rounded-full mb-6 animate-bounce-soft uppercase tracking-widest">
            <MapPin size={14} /> Rio de Janeiro - (21) 98753-7876
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic text-white mb-6 select-none leading-[0.85] tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-racing to-orange-400 uppercase">Force</span>
            <span className="block uppercase text-[0.85em]">Moto</span>
          </h1>
          
          <p className="mt-4 text-zinc-300 max-w-lg mx-auto font-medium text-base md:text-lg leading-relaxed px-4">
            Performance, peças e acessórios com entrega rápida e preço justo.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#catalogo" className="btn-primary text-white font-black px-8 md:px-12 py-4 md:py-5 rounded-2xl shadow-2xl uppercase italic flex items-center gap-2 md:gap-3 text-base md:text-lg">
              <Bike size={24} /> Ver Catálogo
            </a>
            <button 
              onClick={() => {
                const peca = prompt("Qual peça você deseja orçar?");
                if (peca) window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Orçamento para: *${peca}*`, '_blank');
              }}
              className="glass-panel hover:bg-white/20 text-white font-black px-8 md:px-12 py-4 md:py-5 rounded-2xl border border-white/20 transition-all uppercase italic text-base md:text-lg backdrop-blur-md flex items-center gap-2"
            >
              <MessageCircle size={20} /> Orçamento
            </button>
          </div>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Admin Panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            id="admin-panel" 
            className="bg-zinc-900/95 border-y border-racing/30 p-6 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto max-w-7xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-racing rounded-xl flex items-center justify-center">
                    <UserRoundCog className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-racing font-black uppercase italic text-2xl">Painel Admin</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Olá, {currentUser}!</p>
                      <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : dbStatus === 'loading' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} title={dbStatus === 'connected' ? 'Banco Conectado' : 'Erro na Conexão'} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {dbStatus === 'connected' && products.length <= INITIAL_PRODUCTS.length && (
                    <button 
                      onClick={importInitialData}
                      className="bg-zinc-800 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold uppercase transition-all text-xs flex items-center gap-2"
                      title="Importar dados iniciais para o banco"
                    >
                      <Save size={16} /> Importar Iniciais
                    </button>
                  )}
                  <button onClick={handleLogout} className="bg-zinc-800 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold uppercase transition-all flex items-center gap-2">
                    <LogOut size={18} /> Sair
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Staff & Categories */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4 text-zinc-400">
                      <Users size={16} />
                      <p className="text-xs font-bold uppercase">Colaboradores</p>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        id="staff-input"
                        placeholder="Nome completo" 
                        className="input-field flex-1 p-3 rounded-lg text-sm text-white placeholder-zinc-600"
                      />
                      <button 
                        onClick={async () => {
                          const val = (document.getElementById('staff-input') as HTMLInputElement).value;
                          if (val) {
                            const firstName = val.split(' ')[0];
                            const newStaff = { full_name: val, first_name: firstName, login: firstName.toLowerCase() };
                            try {
                              const { data, error } = await supabase
                                .from('staff')
                                .insert([newStaff])
                                .select();
                              if (error) throw error;
                              if (data) setStaff(prev => [...prev, data[0]]);
                              (document.getElementById('staff-input') as HTMLInputElement).value = '';
                              showToast('Sucesso', 'Colaborador cadastrado!');
                            } catch (err) {
                              console.error(err);
                              showToast('Erro', 'Erro ao cadastrar colaborador', 'error');
                            }
                          }
                        }}
                        className="bg-racing text-white px-4 rounded-lg font-bold"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                      {staff.map(s => (
                        <div key={s.login} className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                          <span className="text-xs font-bold">{s.full_name || s.fullName}</span>
                          <button 
                            onClick={async () => {
                              try {
                                const { error } = await supabase.from('staff').delete().eq('login', s.login);
                                if (error) throw error;
                                setStaff(prev => prev.filter(x => x.login !== s.login));
                                showToast('Sucesso', 'Colaborador removido');
                              } catch (err) {
                                console.error(err);
                                showToast('Erro', 'Erro ao remover colaborador', 'error');
                              }
                            }} 
                            className="text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4 text-zinc-400">
                      <Tags size={16} />
                      <p className="text-xs font-bold uppercase">Categorias</p>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        id="cat-input"
                        placeholder="Nova categoria..." 
                        className="input-field flex-1 p-3 rounded-lg text-sm text-white placeholder-zinc-600"
                      />
                      <button 
                        onClick={async () => {
                          const val = (document.getElementById('cat-input') as HTMLInputElement).value;
                          if (val && !categories.includes(val)) {
                            try {
                              const { error } = await supabase.from('categories').insert([{ name: val }]);
                              if (error) throw error;
                              setCategories(prev => [...prev, val]);
                              (document.getElementById('cat-input') as HTMLInputElement).value = '';
                              showToast('Sucesso', 'Categoria adicionada!');
                            } catch (err) {
                              console.error(err);
                              showToast('Erro', 'Erro ao adicionar categoria', 'error');
                            }
                          }
                        }}
                        className="bg-white text-black px-4 rounded-lg font-bold"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <span key={c} className="bg-zinc-800 text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                          {c} <button 
                            onClick={async () => {
                              try {
                                const { error } = await supabase.from('categories').delete().eq('name', c);
                                if (error) throw error;
                                setCategories(prev => prev.filter(x => x !== c));
                                showToast('Sucesso', 'Categoria removida');
                              } catch (err) {
                                console.error(err);
                                showToast('Erro', 'Erro ao remover categoria', 'error');
                              }
                            }}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Form */}
                <div className="lg:col-span-8 glass-panel p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-6 text-zinc-400">
                    <PackageOpen size={18} />
                    <p className="text-xs font-bold uppercase">{editingId ? 'Editar Produto' : 'Novo Produto'}</p>
                  </div>
                  
                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input 
                        value={formName} 
                        onChange={e => setFormName(e.target.value)}
                        placeholder="Nome da Peça *" 
                        className="input-field w-full p-4 rounded-lg text-white placeholder-zinc-600 font-medium" 
                        required 
                      />
                    </div>
                    <input 
                      type="number" 
                      value={formPrice} 
                      onChange={e => setFormPrice(e.target.value)}
                      placeholder="Preço (R$) *" 
                      className="input-field w-full p-4 rounded-lg text-white placeholder-zinc-600" 
                      required 
                    />
                    <select 
                      value={formCat} 
                      onChange={e => setFormCat(e.target.value)}
                      className="input-field w-full p-4 rounded-lg text-white bg-zinc-900" 
                      required
                    >
                      <option value="">Categoria *</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="md:col-span-2">
                      <textarea 
                        value={formDesc} 
                        onChange={e => setFormDesc(e.target.value)}
                        placeholder="Descrição detalhada..." 
                        rows={2} 
                        className="input-field w-full p-4 rounded-lg text-white placeholder-zinc-600 resize-none"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex gap-2 mb-2">
                        <button 
                          type="button" 
                          onClick={() => setUploadTab('file')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border ${uploadTab === 'file' ? 'border-racing text-racing bg-racing/10' : 'border-zinc-800 text-zinc-500'}`}
                        >
                          <CloudUpload size={14} className="inline mr-1" /> Arquivos
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setUploadTab('link')}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border ${uploadTab === 'link' ? 'border-racing text-racing bg-racing/10' : 'border-zinc-800 text-zinc-500'}`}
                        >
                          <LinkIcon size={14} className="inline mr-1" /> Links
                        </button>
                      </div>
                      
                      {uploadTab === 'link' ? (
                        <div className="flex gap-2">
                          <input 
                            value={linkInput}
                            onChange={e => setLinkInput(e.target.value)}
                            placeholder="Link da imagem..." 
                            className="input-field flex-1 p-3 rounded-lg text-sm"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              if (linkInput && formImages.length < 4) {
                                setFormImages(prev => [...prev, linkInput]);
                                setLinkInput('');
                              }
                            }}
                            className="bg-racing text-white px-4 rounded-lg"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center text-zinc-500 text-xs">
                          <p>Upload de arquivos simulado. Use links para demonstração.</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        {formImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-800">
                            <Image src={img} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                            <button 
                              type="button" 
                              onClick={() => setFormImages(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                      <button type="button" onClick={resetForm} className="flex-1 bg-zinc-800 text-white py-4 rounded-lg font-bold uppercase text-sm">Cancelar</button>
                      <button type="submit" className="flex-[2] btn-primary text-white py-4 rounded-lg font-black uppercase text-sm flex items-center justify-center gap-2">
                        <Save size={18} /> {editingId ? 'Atualizar' : 'Salvar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Catalog Section */}
      <div id="catalogo" className="min-h-screen bg-gradient-to-b from-darkness to-zinc-900">
        <header className="sticky top-0 z-40 bg-darkness/95 backdrop-blur-xl border-b border-zinc-800 shadow-2xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-racing rounded-lg flex items-center justify-center">
                  <Bike className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-black italic tracking-tighter text-white">
                    <span className="text-racing">FORCE</span> MOTO
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Catálogo Oficial</p>
                </div>
              </div>
              <button onClick={handleLogin} className="text-zinc-600 hover:text-racing transition-colors p-2 rounded-lg hover:bg-zinc-800">
                <UserRoundCog size={24} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por peça, marca ou modelo..." 
                className="w-full bg-zinc-900/80 border border-zinc-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-racing transition-all shadow-inner text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  <XCircle size={18} />
                </button>
              )}
            </div>

            <nav className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {['Todos', ...categories].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCurrentFilter(cat)}
                  className={`px-6 py-3 rounded-xl whitespace-nowrap font-bold text-sm border transition-all ${currentFilter === cat ? 'bg-racing text-white border-racing' : 'bg-zinc-800 text-zinc-400 border-transparent hover:border-racing/30'}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <motion.div 
                layout
                key={p.id}
                className={`bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden group relative transition-all hover:translate-y-[-8px] hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] ${!p.stock ? 'opacity-60' : ''}`}
                onClick={() => setSelectedProduct(p)}
              >
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); shareProduct(p); }}
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Share2 size={14} />
                  </button>
                </div>

                {isAdmin && (
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); editProduct(p); }} className="bg-blue-600 p-2 rounded-lg text-white shadow-lg hover:scale-110 transition-transform"><Edit size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }} className="bg-red-600 p-2 rounded-lg text-white shadow-lg hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleStock(p.id); }} className={`${p.stock ? 'bg-green-600' : 'bg-zinc-600'} p-2 rounded-lg text-white shadow-lg hover:scale-110 transition-transform`}>
                      {p.stock ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </button>
                  </div>
                )}

                <div className="relative h-56 bg-zinc-800 overflow-hidden">
                  <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`${p.stock ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider`}>
                      {p.stock ? '✓ Disponível' : '✗ Indisponível'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-racing uppercase tracking-wider">{p.category}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">#{p.code}</span>
                  </div>
                  <h3 className="font-black text-lg text-white mb-2 uppercase tracking-tight leading-tight min-h-[3.5rem]">{p.name}</h3>
                  <p className="text-zinc-500 text-xs mb-4 line-clamp-2">{p.desc}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                    <div>
                      <span className="text-xs text-zinc-600 block mb-1">Preço</span>
                      <span className="text-2xl font-black text-white">{formatCurrency(p.price)}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      disabled={!p.stock}
                      className={`${p.stock ? 'bg-white text-black hover:bg-racing hover:text-white' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'} px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all flex items-center gap-2 shadow-lg`}
                    >
                      <Plus size={14} /> {p.stock ? 'Adicionar' : 'Indisponível'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-zinc-600" size={48} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
              <p className="text-zinc-500">Tente buscar com outros termos</p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-0 right-0 px-4 z-40"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full max-w-md mx-auto btn-primary text-white py-4 rounded-2xl shadow-2xl flex justify-between items-center px-8 transform active:scale-95 transition-all border border-white/20"
            >
              <span className="font-black flex items-center gap-3 uppercase tracking-tighter text-lg">
                <div className="relative">
                  <ShoppingBasket size={24} />
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                </div>
                Meu Pedido
              </span>
              <span className="bg-white text-black px-4 py-2 rounded-lg font-black shadow-lg text-lg">{formatCurrency(cartTotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Float */}
      <button 
        onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
        className="fixed bottom-24 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform animate-bounce-soft border-4 border-darkness"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-10 h-10 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-start justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-3xl border border-zinc-700 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col my-auto"
            >
              <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-800">
                <div>
                  <h2 className="text-xl font-black italic text-racing">SEU PEDIDO</h2>
                  <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Revise os itens antes de enviar</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white p-2"><X size={24} /></button>
              </div>
              
              <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.img} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm uppercase truncate">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500 mb-2">{item.category}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center"><ChevronLeft size={14} /></button>
                        <span className="font-black text-white w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center"><ChevronRight size={14} /></button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between shrink-0">
                      <button onClick={() => updateCartQuantity(item.id, -item.quantity)} className="text-zinc-500 hover:text-red-500"><Trash2 size={14} /></button>
                      <span className="font-black text-racing">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-5 bg-zinc-950 border-t border-zinc-800 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Como deseja receber?</label>
                  <select id="checkout-extra" className="w-full border border-zinc-700 p-3 rounded-xl bg-zinc-900 text-white text-sm outline-none">
                    <option value="Retirada no Balcão">🏪 Vou retirar na loja (Balcão)</option>
                    <option value="Entrega via Motoboy">🏍️ Entrega via Motoboy</option>
                    <option value="Envio Correios">📦 Envio por Correios</option>
                  </select>
                </div>
                
                <textarea id="order-notes" placeholder="Observações..." rows={2} className="w-full border border-zinc-700 p-3 rounded-xl bg-zinc-900 text-white text-sm outline-none resize-none" />

                <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Total</span>
                    <span className="text-2xl font-black text-white">{formatCurrency(cartTotal)}</span>
                  </div>
                  <button onClick={() => setCart([])} className="text-zinc-500 text-[10px] font-bold uppercase">Limpar</button>
                </div>
                
                <button onClick={sendOrder} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black flex justify-center items-center gap-2 uppercase italic shadow-lg">
                  <MessageCircle size={20} /> Enviar via WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Gallery Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 rounded-3xl border border-zinc-700 shadow-2xl w-full max-w-4xl relative overflow-hidden"
            >
              <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div className="flex-1 min-w-0 mr-4">
                  <h2 className="text-xl md:text-2xl font-black italic text-white uppercase truncate">{selectedProduct.name}</h2>
                  <p className="text-[10px] text-racing font-bold uppercase mt-1">#{selectedProduct.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => shareProduct(selectedProduct)} className="bg-green-500 text-white p-2 rounded-lg"><Share2 size={18} /></button>
                  <button onClick={() => addToCart(selectedProduct)} className="bg-racing text-white p-2 rounded-lg"><Plus size={18} /></button>
                  <button onClick={() => setSelectedProduct(null)} className="text-zinc-500 p-2"><X size={24} /></button>
                </div>
              </div>
              
              <div className="relative h-[40vh] md:h-[50vh] bg-black flex items-center justify-center">
                <Image 
                  src={(selectedProduct.images || [selectedProduct.img])[galleryIndex]} 
                  alt={selectedProduct.name} 
                  fill 
                  className="object-contain" 
                  referrerPolicy="no-referrer"
                />
                
                {(selectedProduct.images?.length || 0) > 1 && (
                  <>
                    <button 
                      onClick={() => setGalleryIndex(prev => Math.max(0, prev - 1))}
                      className="absolute left-4 bg-black/50 text-white p-3 rounded-full hover:bg-racing transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={() => setGalleryIndex(prev => Math.min((selectedProduct.images?.length || 1) - 1, prev + 1))}
                      className="absolute right-4 bg-black/50 text-white p-3 rounded-full hover:bg-racing transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      {galleryIndex + 1} / {selectedProduct.images?.length}
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar bg-zinc-950/50">
                {(selectedProduct.images || [selectedProduct.img]).map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setGalleryIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${galleryIndex === idx ? 'border-racing' : 'border-transparent opacity-50'}`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              
              <div className="p-6 border-t border-zinc-800">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Descrição</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">{selectedProduct.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Preço</p>
                    <p className="text-4xl font-black text-racing">{formatCurrency(selectedProduct.price)}</p>
                    <p className={`text-[10px] font-bold uppercase mt-2 ${selectedProduct.stock ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedProduct.stock ? '✓ Em estoque' : '✗ Indisponível'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-racing rounded-xl flex items-center justify-center">
                      <UserRoundCog className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase italic">Acesso Restrito</h2>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Área Administrativa</p>
                    </div>
                  </div>
                  <button onClick={() => setIsLoginModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={executeLogin} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block ml-1">Usuário</label>
                    <input 
                      type="text" 
                      value={loginUser}
                      onChange={e => setLoginUser(e.target.value)}
                      placeholder="Seu login..." 
                      className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-racing transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block ml-1">Senha</label>
                    <input 
                      type="password" 
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      placeholder="Sua senha..." 
                      className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-racing transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full btn-primary text-white py-4 rounded-xl font-black uppercase italic text-lg shadow-xl mt-4"
                  >
                    Entrar no Painel
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs px-4"
          >
            <div className={`bg-zinc-800 border ${toast.type === 'success' ? 'border-racing/50' : 'border-red-500/50'} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`}>
              <CheckCircle2 className={toast.type === 'success' ? 'text-racing' : 'text-red-500'} size={20} />
              <div>
                <p className="font-bold text-sm">{toast.title}</p>
                <p className="text-xs text-zinc-400">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
