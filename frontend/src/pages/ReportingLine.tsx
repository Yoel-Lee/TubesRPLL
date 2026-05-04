import { useState, useEffect } from 'react';
import { User as UserIcon, ChevronRight, ChevronDown, Network } from 'lucide-react';
import api from '../lib/api';

// --- KOMPONEN REKURSIF UNTUK MENGGAMBAR CABANG POHON ---
const TreeNode = ({ node }: { node: any }) => {
  const [isOpen, setIsOpen] = useState(true); // Default cabang terbuka
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-2 mt-3">
      <div className="flex items-center gap-3">
        {/* Tombol Buka/Tutup Cabang */}
        {hasChildren ? (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-6 h-6 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div className="w-6 h-6"></div> // Spasi kosong kalau tidak punya bawahan
        )}

        {/* Kartu Profil Pegawai */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-2xl shadow-sm min-w-[280px] hover:border-indigo-300 transition-colors">
          <div className={`p-2 rounded-xl text-white font-black text-sm flex items-center justify-center w-10 h-10 ${node.role === 'ADMIN' ? 'bg-purple-600' : 'bg-blue-500'}`}>
            {node.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{node.name}</p>
            <p className="text-[11px] font-bold text-gray-400 tracking-wider">
              {node.role} {node.email && `• ${node.email.split('@')[0]}`}
            </p>
          </div>
        </div>
      </div>

      {/* Render Anak-anak (Bawahan) jika node ini punya anak dan sedang dibuka */}
      {isOpen && hasChildren && (
        <div className="border-l-2 border-indigo-100 ml-[11px] pl-6 mt-1 space-y-2">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- HALAMAN UTAMA ---
export default function ReportingLine() {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuildTree = async () => {
      try {
        // 1. Ambil semua data pegawai
        const { data } = await api.get('/users');
        
        // 2. Logika Menyusun Tree (Pohon)
        const map = new Map();
        const roots: any[] = [];

        // Buat cetakan dasar untuk setiap user
        data.forEach((user: any) => {
          map.set(user.id, { ...user, children: [] });
        });

        // Susun berdasarkan managerId
        data.forEach((user: any) => {
          if (user.managerId) {
            // Jika punya manajer, masukkan dia ke dalam array children milik manajernya
            const manager = map.get(user.managerId);
            if (manager) {
              manager.children.push(map.get(user.id));
            }
          } else {
            // Jika tidak punya manajer (Bos Besar), dia adalah akar (root)
            roots.push(map.get(user.id));
          }
        });

        setTreeData(roots);
      } catch (error) {
        console.error("Gagal memuat struktur organisasi", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndBuildTree();
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <Network size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Struktur Organisasi</h2>
          <p className="text-gray-500 text-sm">Visualisasi jalur pelaporan (Reporting Line) dari atasan hingga bawahan.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">Menyusun struktur...</div>
        ) : treeData.length > 0 ? (
          <div className="min-w-max pb-10">
            {treeData.map((rootNode) => (
              <TreeNode key={rootNode.id} node={rootNode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 font-bold">Data pegawai tidak ditemukan.</div>
        )}
      </div>
    </div>
  );
}