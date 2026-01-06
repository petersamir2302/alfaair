'use client';

import { Product } from '@/lib/supabase/types';
import { useLanguage } from './LanguageProvider';
import { getTranslation } from '@/lib/i18n';
import { Edit, Trash2, GripVertical, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProductTableProps {
  products: Product[];
}

interface SortableRowProps {
  product: Product;
  language: 'ar' | 'en';
  t: (key: keyof typeof import('@/lib/i18n').translations.ar) => string;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

function SortableRow({ product, language, t, deletingId, onDelete }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const name = language === 'ar' ? product.name_ar : product.name_en;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t border-secondary/20 hover:bg-accent-light/50 ${isDragging ? 'bg-accent-light' : ''}`}
    >
      <td className="px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-secondary hover:text-primary transition-colors p-1"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </td>
      <td className="px-4 py-3">
        {product.image_url ? (
          <div className="relative w-16 h-16 rounded overflow-hidden">
            <Image
              src={product.image_url}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-secondary/20 rounded"></div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-primary">{name}</div>
      </td>
      <td className="px-4 py-3 text-secondary">
        {product.price 
          ? `${product.price.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}${product.price_before ? ` (${language === 'ar' ? 'كان' : 'was'} ${product.price_before.toLocaleString()})` : ''}`
          : '-'}
      </td>
      <td className="px-4 py-3">
        {product.inventory !== null ? (
          <span className={`font-semibold ${product.inventory === 0 ? 'text-red-600' : 'text-secondary'}`}>
            {product.inventory === 0 ? t('soldOut') : product.inventory}
          </span>
        ) : '-'}
      </td>
      <td className="px-4 py-3 text-secondary">
        {product.power_hp ? `${product.power_hp} HP` : '-'}
      </td>
      <td className="px-4 py-3 text-secondary">
        {product.color || '-'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            disabled={deletingId === product.id}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ProductTable({ products: initialProducts }: ProductTableProps) {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('@/lib/i18n').translations.ar) => getTranslation(language, key);
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync products when initialProducts changes
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const nameAr = (product.name_ar || '').toLowerCase();
    const nameEn = (product.name_en || '').toLowerCase();
    const color = (product.color || '').toLowerCase();
    const price = product.price?.toString() || '';
    const powerHp = product.power_hp?.toString() || '';
    
    return (
      nameAr.includes(query) ||
      nameEn.includes(query) ||
      color.includes(query) ||
      price.includes(query) ||
      powerHp.includes(query)
    );
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      alert(error.message);
    } else {
      router.refresh();
    }
    setDeletingId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find indices in the full products array (not filtered)
    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update the UI
    const newProducts = arrayMove(products, oldIndex, newIndex);
    setProducts(newProducts);

    // Update order values
    const productOrders = newProducts.map((product, index) => ({
      id: product.id,
      order: index + 1,
    }));

    // Save to database
    setIsUpdating(true);
    try {
      const response = await fetch('/api/products/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productOrders }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product order');
      }

      // Refresh to get updated data
      router.refresh();
    } catch (error) {
      console.error('Error updating product order:', error);
      alert('Failed to save product order. Please try again.');
      // Revert to original order
      setProducts(initialProducts);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-primary/10 overflow-hidden">
      {isUpdating && (
        <div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm text-center">
          {t('saving') || 'Saving order...'}
        </div>
      )}
      <div className="p-4 border-b border-primary/10">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full">
            <thead className="bg-accent">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary w-12"></th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('image')}</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('name')}</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('price')}</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('inventory')}</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('power')}</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('color')}</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-secondary">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={filteredProducts.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredProducts.map((product) => (
                  <SortableRow
                    key={product.id}
                    product={product}
                    language={language}
                    t={t}
                    deletingId={deletingId}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-secondary">
            {searchQuery.trim() ? (
              language === 'ar' ? 'لا توجد نتائج للبحث' : 'No search results found'
            ) : (
              t('noProducts')
            )}
          </div>
        )}
      </div>
    </div>
  );
}
