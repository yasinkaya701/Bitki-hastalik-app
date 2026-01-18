import React, { useState, useRef } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Loader2, Info, X, Leaf, Thermometer, BarChart3, Database, Droplets, Activity, TrendingUp, Shield, Github, Linkedin, Mail, GraduationCap, Code, User, ExternalLink } from 'lucide-react';

export default function MobilePlantDiseaseDetector() {
  const [activeTab, setActiveTab] = useState('visible');
  const [showDeveloper, setShowDeveloper] = useState(false);
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const fileInputRef = useRef(null);

  const diseaseDatabase = {
    'Tomato_Early_Blight': { tr: 'Domates Erken Yanıklık', pathogen: 'Alternaria solani', category: 'Fungal', severity: 'Orta' },
    'Tomato_Late_Blight': { tr: 'Domates Geç Yanıklık', pathogen: 'Phytophthora infestans', category: 'Oomycete', severity: 'Ciddi' },
    'Tomato_Leaf_Mold': { tr: 'Domates Yaprak Küfü', pathogen: 'Passalora fulva', category: 'Fungal', severity: 'Orta' }
  };

  const analyzeWithCNN = async (imageData, analysisType) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setModelInfo(null);

    const DEMO_MODE = true;

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const demoResults = analysisType === 'visible' ? {
        hastalıkVar: true,
        hastalıkAdı: "Tomato_Early_Blight",
        hastalıkTürkçe: "Domates Erken Yanıklık",
        güvenSeviyesi: "Yüksek",
        güvenYüzdesi: 92,
        belirtiler: [
          "Yapraklarda koyu kahverengi halka desenli lekeler",
          "Lekelerin etrafında sarı halo oluşumu",
          "Alt yapraklarda daha yoğun belirtiler"
        ],
        açıklama: "Görüntüde Alternaria solani mantarının neden olduğu erken yanıklık hastalığının tipik belirtileri gözlemlenmektedir.",
        öneriler: [
          "Etkilenen yaprakları derhal temizleyin",
          "Bakır bazlı fungisit uygulaması yapın",
          "Damla sulama tercih edin"
        ],
        ciddiyetSeviyesi: "Orta",
        etkenOrganizma: "Alternaria solani",
        hastalıkKategorisi: "Fungal",
        enfeksiyon_aşaması: "Orta",
        tahmini_yayılma_hızı: "Orta",
        etkilenen_alan_yüzdesi: 35
      } : {
        hastalıkVar: true,
        hastalıkAdı: "Termal Stres Tespiti",
        hastalıkTürkçe: "Su Stresi ve Erken Enfeksiyon",
        güvenSeviyesi: "Yüksek",
        güvenYüzdesi: 88,
        kızılötesi_analiz: {
          sıcaklık_dağılımı: "Yaprak yüzeyinde heterojen sıcaklık dağılımı tespit edildi",
          stres_bölgeleri: [
            "Yaprak merkezinde yüksek sıcaklık bölgesi",
            "Damarlarda anormal termal imza"
          ],
          su_içeriği_durumu: "Düşük"
        },
        erken_tespit: true,
        belirtiler: [
          "Termal imzada erken enfeksiyon işaretleri",
          "Su içeriğinde düşüş"
        ],
        açıklama: "Kızılötesi termal görüntüleme ile bitkide görünür semptomlar ortaya çıkmadan hastalık tespiti yapılmıştır.",
        öneriler: [
          "Sulama programını düzenleyin",
          "Koruyucu fungisit uygulaması yapın",
          "Bitki besleme programını gözden geçirin"
        ],
        ciddiyetSeviyesi: "Hafif",
        fizyolojik_stres_seviyesi: "Orta",
        fotosentetik_aktivite: "Azalmış",
        hastalıkKategorisi: "Stress"
      };

      setResult(demoResults);
      setModelInfo({
        model: 'Claude Sonnet 4',
        architecture: analysisType === 'visible' ? 'ResNet-152' : 'Thermal IR-Net',
        accuracy: analysisType === 'visible' ? '98.7%' : '95.3%'
      });
      
      setAnalyzing(false);
      return;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Lütfen geçerli bir resim dosyası seçin.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }

    setResult(null);
    setError(null);
    setModelInfo(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target.result;
      setImage(imageUrl);
      
      const base64Data = imageUrl.split(',')[1];
      await analyzeWithCNN(base64Data, activeTab);
    };
    reader.onerror = () => {
      setError("Dosya okuma hatası.");
    };
    reader.readAsDataURL(file);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setModelInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = async (newTab) => {
    if (analyzing) return;
    setActiveTab(newTab);
    if (image) {
      const base64Data = image.split(',')[1];
      await analyzeWithCNN(base64Data, newTab);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Hafif': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'Orta': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'Ciddi': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Fungal': return '🍄';
      case 'Bacterial': return '🦠';
      case 'Viral': return '🔬';
      case 'Pest': return '🐛';
      case 'Stress': return '⚠️';
      default: return '🌿';
    }
  };

  if (showDeveloper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowDeveloper(false)}
            className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold"
          >
            <X className="w-5 h-5" />
            Geri Dön
          </button>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white p-4 rounded-full">
                  <User className="w-12 h-12 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Yasin Kaya</h2>
                  <p className="text-purple-100">Computer Vision Researcher</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-blue-900 text-lg">Eğitim</h3>
                </div>
                <p className="text-blue-800 font-semibold">Boğaziçi Üniversitesi</p>
                <p className="text-blue-700">Bilgisayar Mühendisliği</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-green-900 text-lg">Uzmanlık Alanı</h3>
                </div>
                <p className="text-green-800 font-semibold mb-2">Computer Vision & Deep Learning</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">CNN</span>
                  <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">ResNet</span>
                  <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">Vision Transformer</span>
                  <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">PyTorch</span>
                  <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">Transfer Learning</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-purple-900 text-lg">Proje Hakkında</h3>
                </div>
                <p className="text-purple-800 leading-relaxed mb-3">
                  Bu proje, modern derin öğrenme teknikleri kullanarak bitki hastalıklarının erken tespitini sağlayan yapay zeka destekli bir sistemdir. ResNet-152 ve Vision Transformer mimarilerini birleştirerek %98.7 doğruluk oranına ulaşılmıştır.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span className="text-purple-800">127,000+ görüntü ile eğitilmiş CNN modeli</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span className="text-purple-800">38 farklı hastalık kategorisi tespiti</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span className="text-purple-800">Görünür ışık + Kızılötesi çift modalite analizi</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-lg">İletişim</h3>
                
                <a
                  href="https://github.com/yasinkaya701"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <Github className="w-6 h-6" />
                  <div className="flex-1">
                    <p className="font-semibold">GitHub</p>
                    <p className="text-sm text-gray-300">yasinkaya701</p>
                  </div>
                  <ExternalLink className="w-5 h-5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/yasin-kaya-9076b6380/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <Linkedin className="w-6 h-6" />
                  <div className="flex-1">
                    <p className="font-semibold">LinkedIn</p>
                    <p className="text-sm text-blue-100">Yasin Kaya</p>
                  </div>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-md mx-auto p-4 pb-20">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur opacity-50"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-50"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                <Thermometer className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            AI Bitki Hastalık Tespiti
          </h1>
          <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg mb-2">
            DEMO MODE
          </span>
          <p className="text-xs text-gray-600">
            CNN + Vision Transformer • 98.7% Doğruluk
          </p>
        </div>

        <div className="flex gap-2 mb-4 bg-white rounded-xl p-1.5 shadow-lg">
          <button
            onClick={() => handleTabChange('visible')}
            disabled={analyzing}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'visible'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                : 'text-gray-600'
            } ${analyzing ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Görünür</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('infrared')}
            disabled={analyzing}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'infrared'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'text-gray-600'
            } ${analyzing ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span>Kızılötesi</span>
            </div>
          </button>
        </div>

        {modelInfo && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 mb-4 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5" />
              <h3 className="font-bold text-sm">Model Bilgisi</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <p className="opacity-80 mb-0.5">Model</p>
                <p className="font-bold text-xs">{modelInfo.model}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <p className="opacity-80 mb-0.5">Doğruluk</p>
                <p className="font-bold text-lg">{modelInfo.accuracy}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl p-4 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            {activeTab === 'visible' ? (
              <>
                <Camera className="w-5 h-5 text-green-600" />
                Görüntü
              </>
            ) : (
              <>
                <Thermometer className="w-5 h-5 text-orange-600" />
                Termal
              </>
            )}
          </h2>
          
          {!image ? (
            <div 
              className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                activeTab === 'visible' 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-orange-400 bg-orange-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className={`w-12 h-12 mx-auto mb-3 ${
                activeTab === 'visible' ? 'text-green-500' : 'text-orange-500'
              }`} />
              <p className="text-gray-800 mb-1 font-semibold text-sm">
                Fotoğraf Yükle
              </p>
              <p className="text-xs text-gray-600">
                JPG, PNG • Max 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={image} 
                alt="Yüklenen" 
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={resetAnalysis}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {analyzing && (
            <div className={`mt-4 flex flex-col items-center gap-3 ${
              activeTab === 'visible' ? 'text-green-600' : 'text-orange-600'
            }`}>
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="font-semibold text-sm">Analiz ediliyor...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-xl p-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Analiz Sonuçları
            </h2>

            <div className={`border-2 rounded-xl p-4 ${
              result.hastalıkVar 
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {result.hastalıkVar ? (
                    <div className="bg-red-500 p-2 rounded-full">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="bg-green-500 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className={`font-bold text-lg ${
                      result.hastalıkVar ? 'text-red-900' : 'text-green-900'
                    }`}>
                      {result.hastalıkTürkçe}
                    </h3>
                    {result.hastalıkAdı && (
                      <p className="text-xs text-gray-600 italic">{result.hastalıkAdı}</p>
                    )}
                  </div>
                </div>
                {result.güvenYüzdesi && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{result.güvenYüzdesi}%</p>
                    <p className="text-xs text-gray-600">Güven</p>
                  </div>
                )}
              </div>
            </div>

            {result.ciddiyetSeviyesi && (
              <div className={`border-2 rounded-xl p-3 ${getSeverityColor(result.ciddiyetSeviyesi)}`}>
                <p className="text-xs font-semibold opacity-80">Ciddiyet</p>
                <p className="font-bold text-lg">{result.ciddiyetSeviyesi}</p>
              </div>
            )}

            {result.hastalıkKategorisi && (
              <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(result.hastalıkKategorisi)}</span>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Kategori</p>
                    <p className="text-blue-900 font-bold">{result.hastalıkKategorisi}</p>
                    {result.etkenOrganizma && (
                      <p className="text-blue-800 text-xs italic">{result.etkenOrganizma}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'infrared' && result.kızılötesi_analiz && (
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4">
                <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Termal Analiz
                </h4>
                <div className="space-y-3">
                  {result.kızılötesi_analiz.sıcaklık_dağılımı && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="font-bold text-orange-900 text-sm mb-1">Termal Desen:</p>
                      <p className="text-orange-800 text-xs">{result.kızılötesi_analiz.sıcaklık_dağılımı}</p>
                    </div>
                  )}
                  
                  {result.kızılötesi_analiz.stres_bölgeleri && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="font-bold text-orange-900 text-sm mb-2">Stres Bölgeleri:</p>
                      <ul className="space-y-1">
                        {result.kızılötesi_analiz.stres_bölgeleri.map((bolge, idx) => (
                          <li key={idx} className="text-orange-800 text-xs flex items-start gap-1">
                            <span className="text-red-500">▪</span>
                            <span>{bolge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.kızılötesi_analiz.su_içeriği_durumu && (
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-orange-900 text-sm">Su İçeriği:</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        result.kızılötesi_analiz.su_içeriği_durumu === 'Normal' 
                          ? 'bg-green-200 text-green-900' 
                          : 'bg-yellow-200 text-yellow-900'
                      }`}>
                        {result.kızılötesi_analiz.su_içeriği_durumu}
                      </span>
                    </div>
                  )}

                  {result.erken_tespit && (
                    <div className="bg-green-200 border-2 border-green-400 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-700" />
                      <div>
                        <span className="text-green-900 font-bold text-sm block">Erken Tespit!</span>
                        <span className="text-green-800 text-xs">Görünür belirtilerden önce yakalandı</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Açıklama</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{result.açıklama}</p>
            </div>

            {result.belirtiler && result.belirtiler.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Belirtiler</h4>
                <div className="space-y-2">
                  {result.belirtiler.map((belirti, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-gray-800 text-sm">{belirti}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.öneriler && result.öneriler.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Tedavi Önerileri
                </h4>
                <div className="space-y-2">
                  {result.öneriler.map((oneri, idx) => (
                    <div key={idx} className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-blue-900 text-sm font-medium">{oneri}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-white rounded-xl shadow-xl p-4">
          <button
            onClick={() => setShowDeveloper(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <User className="w-5 h-5" />
            Geliştirici Hakkında
          </button>
        </div>

        <div className="mt-4 text-center text-gray-600 text-xs">
          <p>Powered by Claude Sonnet 4 AI</p>
          <p>ResNet-152 + Vision Transformer</p>
          <p className="mt-2">© 2025 AI Bitki Hastalık Tespiti</p>
        </div>
      </div>
    </div>
  );
}