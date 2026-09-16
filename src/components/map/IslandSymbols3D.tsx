/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * 1. AKADEMI PROSEDURIA (2.5D / 3D Sapphire & Crystal Floating Citadel)
 * - Layered floating rock plinth with glowing crystal veins & waterfalls
 * - Majestic sapphire cathedral with gothic towers, golden spires, stained-glass windows
 * - Floating glowing ancient logic grimoire
 * - Celestial orbiting magic rune rings
 * - Soaring sky-beam beacon with particle energy
 */
export const AkademiProseduriaSymbol3D: React.FC<{ isActive?: boolean }> = ({ isActive = true }) => {
  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.95)]">
      {/* Active Sky-Beam Light Column */}
      {isActive && (
        <>
          <div className="absolute -top-24 w-1.5 h-24 bg-gradient-to-t from-cyan-400 via-sky-300 to-transparent animate-pulse pointer-events-none" />
          <div className="absolute -top-24 w-10 h-10 rounded-full bg-cyan-400/30 blur-lg animate-ping pointer-events-none" />
          <div className="absolute -inset-6 rounded-full border border-cyan-400/40 animate-ping pointer-events-none" />
          <div className="absolute -inset-3 rounded-full border-2 border-cyan-300/60 animate-pulse pointer-events-none" />
        </>
      )}

      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="sapphireSpire" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
          <linearGradient id="stoneStrata" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F2F4E" />
            <stop offset="40%" stopColor="#0B1E34" />
            <stop offset="100%" stopColor="#050E1A" />
          </linearGradient>
          <linearGradient id="crystalWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* --- 3D FLOATING ISLAND ROCK BASE --- */}
        {/* Deep rocky underbelly with strata facets */}
        <polygon points="20,86 70,128 120,86 100,74 40,74" fill="url(#stoneStrata)" stroke="#1E40AF" strokeWidth="1.5" />
        <polygon points="40,94 70,128 64,98" fill="#071829" opacity="0.6" />
        <polygon points="70,128 98,94 76,98" fill="#1E3A8A" opacity="0.4" />
        {/* Crystal Veins in Rock */}
        <line x1="45" y1="92" x2="55" y2="108" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="85" y1="90" x2="75" y2="112" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* Cascading Crystal Waterfalls */}
        <path d="M 32 84 L 32 106 L 36 106 L 36 84 Z" fill="url(#crystalWater)" />
        <path d="M 104 84 L 104 104 L 108 104 L 108 84 Z" fill="url(#crystalWater)" />

        {/* Lush Green & Azure Plateau Surface */}
        <ellipse cx="70" cy="84" rx="52" ry="18" fill="#0E3A5A" stroke="#38BDF8" strokeWidth="1.5" />
        <ellipse cx="70" cy="82" rx="46" ry="14" fill="#0284C7" opacity="0.35" />

        {/* --- MAJESTIC SAPPHIRE CASTLE & CITADEL --- */}
        {/* Castle Foundation & Walls */}
        <rect x="46" y="52" width="48" height="32" rx="3" fill="#1E3A8A" stroke="url(#goldTrim)" strokeWidth="1.5" />
        <path d="M 52 52 L 52 48 L 56 48 L 56 52 L 62 52 L 62 48 L 66 48 L 66 52 L 74 52 L 74 48 L 78 48 L 78 52 L 84 52 L 84 48 L 88 48 L 88 52" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />

        {/* Left Spire */}
        <rect x="30" y="44" width="16" height="38" rx="2" fill="#172554" stroke="url(#goldTrim)" strokeWidth="1.2" />
        <polygon points="38,20 28,44 48,44" fill="url(#sapphireSpire)" stroke="#BAE6FD" strokeWidth="1.2" />
        <circle cx="38" cy="18" r="2.5" fill="url(#goldTrim)" />

        {/* Right Spire */}
        <rect x="94" y="44" width="16" height="38" rx="2" fill="#172554" stroke="url(#goldTrim)" strokeWidth="1.2" />
        <polygon points="102,20 92,44 112,44" fill="url(#sapphireSpire)" stroke="#BAE6FD" strokeWidth="1.2" />
        <circle cx="102" cy="18" r="2.5" fill="url(#goldTrim)" />

        {/* Grand Central Cathedral Tower */}
        <rect x="54" y="32" width="32" height="42" fill="#1E40AF" stroke="url(#goldTrim)" strokeWidth="1.5" />
        <polygon points="70,8 52,32 88,32" fill="url(#sapphireSpire)" stroke="#E0F2FE" strokeWidth="1.8" />
        <circle cx="70" cy="7" r="3.5" fill="#FFE082" stroke="#D4AF37" strokeWidth="1" />

        {/* Glowing Rose Stained Glass Window */}
        <circle cx="70" cy="46" r="7.5" fill="#0284C7" stroke="url(#goldTrim)" strokeWidth="1.5" />
        <polygon points="70,40 76,46 70,52 64,46" fill="#BAE6FD" className="animate-pulse" />

        {/* Grand Gold Arched Gateway with Light */}
        <path d="M 62 84 L 62 66 Q 70 58 78 66 L 78 84 Z" fill="#D4AF37" stroke="#FEF08A" strokeWidth="1.2" />
        <path d="M 65 84 L 65 68 Q 70 63 75 68 L 75 84 Z" fill="#0284C7" />

        {/* Floating Grimoire (Buku Prosedur Suci) */}
        <g transform="translate(62, 14)">
          <polygon points="0,6 8,2 16,6 16,14 8,10 0,14" fill="#38BDF8" stroke="#FFE082" strokeWidth="1" />
          <line x1="8" y1="2" x2="8" y2="10" stroke="#FFE082" strokeWidth="1" />
        </g>

        {/* Orbiting Magical Rune Rings */}
        <ellipse cx="70" cy="70" rx="60" ry="24" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 8" opacity="0.75" className="animate-spin-slow" />
      </svg>
    </div>
  );
};

/**
 * 2. PULAU RASA NUSANTARA (2.5D / 3D Indonesian Spice Joglo & Boiling Cauldron)
 * - Volumetric cinnamon-soil floating island with tropical palms
 * - Indonesian tiered timber Joglo roof with golden bubungan finials
 * - Copper spice cauldron on stone hearth with rising aromatic steam
 * - Red chili & ginger root garlands, warm glowing amber lanterns
 */
export const PulauRasaNusantaraSymbol3D: React.FC = () => {
  return (
    <div className="relative w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.9)]">
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="jogloTeak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="cauldronBronze" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="spiceEarth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5F260C" />
            <stop offset="50%" stopColor="#3F1706" />
            <stop offset="100%" stopColor="#1C0902" />
          </linearGradient>
        </defs>

        {/* Island Rock Plinth with Terracotta Soil */}
        <polygon points="24,86 70,126 116,86 98,76 42,76" fill="url(#spiceEarth)" stroke="#B45309" strokeWidth="1.5" />
        <ellipse cx="70" cy="84" rx="48" ry="16" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
        <ellipse cx="70" cy="82" rx="42" ry="12" fill="#92400E" opacity="0.6" />

        {/* Tropical Palm Fronds on the side */}
        <path d="M 28 80 Q 20 64 12 68 Q 22 72 26 82" stroke="#10B981" strokeWidth="2.5" fill="none" />
        <path d="M 28 80 Q 22 56 34 58 Q 30 68 28 82" stroke="#059669" strokeWidth="2.5" fill="none" />

        {/* Traditional Indonesian Joglo Pavilion Roof (Atap Tumpang Kayu Jati) */}
        {/* Tier 1 Roof (Lower Eaves) */}
        <polygon points="70,32 30,56 110,56" fill="url(#jogloTeak)" stroke="#FDE68A" strokeWidth="1.5" />
        {/* Tier 2 Roof (Upper Steep Crest) */}
        <polygon points="70,18 44,36 96,36" fill="#92400E" stroke="#FEF08A" strokeWidth="1.5" />
        {/* Carved Golden Horn Finial (Bubungan Makara) */}
        <path d="M 64 18 Q 70 8 76 18 Z" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.2" />
        <circle cx="70" cy="10" r="2.5" fill="#FEF08A" />

        {/* Teak Wood Support Pillars */}
        <rect x="42" y="56" width="6" height="26" fill="#451A03" stroke="#B45309" strokeWidth="1" />
        <rect x="92" y="56" width="6" height="26" fill="#451A03" stroke="#B45309" strokeWidth="1" />
        <rect x="58" y="56" width="5" height="26" fill="#78350F" />
        <rect x="77" y="56" width="5" height="26" fill="#78350F" />

        {/* Flaming Cooking Cauldron on Hearth */}
        {/* Charcoal & Red Embers */}
        <ellipse cx="70" cy="80" rx="14" ry="4" fill="#DC2626" opacity="0.8" className="animate-pulse" />
        {/* Copper Cauldron Body */}
        <path d="M 54 66 Q 52 80 70 80 Q 88 80 86 66 Z" fill="url(#cauldronBronze)" stroke="#FEF08A" strokeWidth="1.5" />
        <ellipse cx="70" cy="66" rx="16" ry="5.5" fill="#B45309" stroke="#FDE68A" strokeWidth="1.2" />
        {/* Bubbling Golden Herbal Jamu Broth */}
        <ellipse cx="70" cy="66" rx="13" ry="4" fill="#F59E0B" className="animate-pulse" />

        {/* Rising Aromatic Steam & Herbs */}
        <path d="M 65 62 Q 62 52 68 46 Q 72 40 68 34" stroke="#FEF08A" strokeWidth="1.8" fill="none" opacity="0.8" strokeDasharray="3 3" />
        <path d="M 75 62 Q 78 54 73 48 Q 69 42 74 36" stroke="#FEF08A" strokeWidth="1.8" fill="none" opacity="0.8" strokeDasharray="3 3" />

        {/* Hanging Garlands: Chili & Ginger */}
        <path d="M 38 60 Q 42 66 38 72" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="42" cy="74" r="2.5" fill="#EF4444" />
        <path d="M 102 60 Q 98 66 102 72" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Warm Glowing Hanging Bamboo Lanterns */}
        <g transform="translate(32, 54)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#F59E0B" strokeWidth="1" />
          <ellipse cx="0" cy="12" rx="4" ry="5" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" className="animate-pulse" />
        </g>
        <g transform="translate(108, 54)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#F59E0B" strokeWidth="1" />
          <ellipse cx="0" cy="12" rx="4" ry="5" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

/**
 * 3. PULAU BUMI HIJAU (2.5D / 3D Crystal Biosphere Dome & Stepped Waterfalls)
 * - Layered emerald stepped rice terraces with cascading waterfalls
 * - Geodesic crystal glass dome with specular highlights & faceted reflections
 * - Ancient tropical Banyan tree inside with glowing golden sap
 * - Floating botanical leaf runes & nature aura
 */
export const PulauBumiHijauSymbol3D: React.FC = () => {
  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_14px_26px_rgba(0,0,0,0.9)]">
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="emeraldBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>
          <linearGradient id="glassDome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#34D399" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Terraced Mountain Island Base */}
        <polygon points="20,86 70,128 120,86 98,74 42,74" fill="url(#emeraldBase)" stroke="#10B981" strokeWidth="1.5" />
        {/* Tiered Terrace Steps (Sawah Berundak) */}
        <path d="M 28 82 Q 70 98 112 82 L 106 88 Q 70 104 34 88 Z" fill="#059669" stroke="#34D399" strokeWidth="1" />
        <path d="M 36 92 Q 70 108 104 92 L 98 98 Q 70 114 42 98 Z" fill="#047857" stroke="#10B981" strokeWidth="1" />

        {/* Cascading Crystal Waterfall streaming into Clouds */}
        <path d="M 66 84 L 66 118 L 74 118 L 74 84 Z" fill="#38BDF8" opacity="0.85" />
        <ellipse cx="70" cy="118" rx="8" ry="3" fill="#BAE6FD" opacity="0.8" className="animate-ping" />

        {/* Plateau Surface */}
        <ellipse cx="70" cy="80" rx="48" ry="16" fill="#065F46" stroke="#6EE7B7" strokeWidth="1.5" />

        {/* GEODESIC CRYSTAL BIOSPHERE DOME */}
        <circle cx="70" cy="52" r="28" fill="url(#glassDome)" stroke="#A7F3D0" strokeWidth="1.8" />
        {/* Geodesic Structural Facet Lines */}
        <ellipse cx="70" cy="52" rx="22" ry="28" fill="none" stroke="#D1FAE5" strokeWidth="0.9" strokeDasharray="4 2" />
        <ellipse cx="70" cy="52" rx="28" ry="12" fill="none" stroke="#D1FAE5" strokeWidth="0.9" />
        <line x1="70" y1="24" x2="70" y2="80" stroke="#D1FAE5" strokeWidth="1" />

        {/* Sacred Tropical Banyan Tree inside Dome */}
        {/* Trunk & Roots */}
        <path d="M 66 76 L 68 56 Q 70 54 72 56 L 74 76 Z" fill="#78350F" stroke="#B45309" strokeWidth="1" />
        {/* Lush Foliage Canopy */}
        <circle cx="70" cy="48" r="14" fill="#10B981" opacity="0.9" />
        <circle cx="62" cy="52" r="10" fill="#059669" opacity="0.85" />
        <circle cx="78" cy="52" r="10" fill="#059669" opacity="0.85" />
        <circle cx="70" cy="44" r="8" fill="#34D399" opacity="0.9" />

        {/* Specular Highlight on Glass Dome */}
        <ellipse cx="58" cy="38" rx="7" ry="4" transform="rotate(-30 58 38)" fill="#FFFFFF" opacity="0.75" />

        {/* Floating Botanical Leaf Rune */}
        <g transform="translate(64, 12)">
          <path d="M 6 0 C 14 6 14 14 6 18 C -2 14 -2 6 6 0 Z" fill="#34D399" stroke="#FEF08A" strokeWidth="1" className="animate-pulse" />
          <line x1="6" y1="2" x2="6" y2="16" stroke="#FEF08A" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
};

/**
 * 4. PULAU WARISAN (2.5D / 3D Red Terracotta Paduraksa Split Candi & Gamelan)
 * - Carved red terracotta brick temple plinth with Majapahit reliefs
 * - Majestic Paduraksa Temple Gateway with golden finials
 * - Suspended bronze Gamelan Gong with mallet & red braided cords
 * - Hovering golden Batik Canting tool with glowing wax trails
 * - Deep crimson ceremonial pennants (Umbul-umbul)
 */
export const PulauWarisanSymbol3D: React.FC = () => {
  return (
    <div className="relative w-30 h-30 sm:w-34 sm:h-34 flex items-center justify-center filter drop-shadow-[0_14px_24px_rgba(0,0,0,0.9)]">
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="terracottaCandi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="50%" stopColor="#831843" />
            <stop offset="100%" stopColor="#500724" />
          </linearGradient>
          <linearGradient id="bronzeGong" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Ancient Terracotta Foundation Base */}
        <polygon points="22,86 70,126 118,86 98,76 42,76" fill="#700C36" stroke="#EC4899" strokeWidth="1.5" />
        <ellipse cx="70" cy="84" rx="48" ry="16" fill="#831843" stroke="#F472B6" strokeWidth="1.5" />

        {/* Ceremonial Umbul-umbul Pennants */}
        <line x1="28" y1="84" x2="28" y2="40" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M 28 40 Q 20 48 28 56 Q 22 64 28 72" fill="none" stroke="#EF4444" strokeWidth="2.5" />

        <line x1="112" y1="84" x2="112" y2="40" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M 112 40 Q 120 48 112 56 Q 118 64 112 72" fill="none" stroke="#EF4444" strokeWidth="2.5" />

        {/* --- PADURAKSA SPLIT TEMPLE GATE (CANDI BENTAR) --- */}
        {/* Left Candi Wing */}
        <polygon points="56,22 42,38 42,80 56,80" fill="url(#terracottaCandi)" stroke="#FBCFE8" strokeWidth="1.5" />
        <polygon points="56,22 50,38 56,38" fill="#BE185D" />
        <rect x="42" y="48" width="14" height="4" fill="#9D174D" stroke="#F472B6" strokeWidth="0.8" />
        <rect x="42" y="62" width="14" height="4" fill="#9D174D" stroke="#F472B6" strokeWidth="0.8" />

        {/* Right Candi Wing */}
        <polygon points="84,22 98,38 98,80 84,80" fill="url(#terracottaCandi)" stroke="#FBCFE8" strokeWidth="1.5" />
        <polygon points="84,22 90,38 84,38" fill="#BE185D" />
        <rect x="84" y="48" width="14" height="4" fill="#9D174D" stroke="#F472B6" strokeWidth="0.8" />
        <rect x="84" y="62" width="14" height="4" fill="#9D174D" stroke="#F472B6" strokeWidth="0.8" />

        {/* Golden Temple Spires */}
        <polygon points="49,12 45,22 53,22" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
        <polygon points="91,12 87,22 95,22" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />

        {/* Suspended Bronze Gamelan Gong in Gateway Center */}
        {/* Hanging Frame & Cords */}
        <line x1="60" y1="42" x2="80" y2="42" stroke="#78350F" strokeWidth="2" />
        <line x1="64" y1="42" x2="67" y2="52" stroke="#EF4444" strokeWidth="1.2" />
        <line x1="76" y1="42" x2="73" y2="52" stroke="#EF4444" strokeWidth="1.2" />
        {/* Gong Disc */}
        <circle cx="70" cy="62" r="11" fill="url(#bronzeGong)" stroke="#FEF08A" strokeWidth="1.5" />
        {/* Central Raised Boss (Pencu Gong) */}
        <circle cx="70" cy="62" r="3.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />

        {/* Floating Golden Batik Canting Tool with Glowing Wax Line */}
        <g transform="translate(62, 14)">
          <path d="M 0 10 L 8 4 Q 14 0 16 6 L 12 12 Z" fill="#D4AF37" stroke="#FEF08A" strokeWidth="1" />
          <line x1="16" y1="6" x2="20" y2="8" stroke="#FFE082" strokeWidth="1.5" />
          {/* Glowing Batik Wax Swirl */}
          <path d="M 20 8 Q 24 14 28 10 Q 32 6 36 12" stroke="#FDE68A" strokeWidth="1.5" fill="none" opacity="0.9" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

/**
 * 5. PULAU KARYA (2.5D / 3D Steampunk Artisan Clockwork Forge & Workshop)
 * - Industrial basalt foundry island with brass piping & rivets
 * - Multi-layered interlocking brass gears visibly rotating smoothly
 * - Masonry blast furnace with glowing sapphire-blue fire & chimney steam
 * - Waterwheel over cooling canal & golden drafting compass
 */
export const PulauKaryaSymbol3D: React.FC = () => {
  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_14px_26px_rgba(0,0,0,0.9)]">
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="ironForge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="50%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="brassGear" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Heavy Basalt Island Base with Metal Rivets */}
        <polygon points="22,86 70,128 118,86 98,76 42,76" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
        <ellipse cx="70" cy="84" rx="48" ry="16" fill="#312E81" stroke="#818CF8" strokeWidth="1.5" />

        {/* Industrial Waterwheel on the side */}
        <circle cx="34" cy="74" r="12" fill="none" stroke="#B45309" strokeWidth="2.5" strokeDasharray="4 3" className="animate-spin-slow" />
        <circle cx="34" cy="74" r="4" fill="#78350F" />

        {/* Artisan Forge Workshop & Furnace */}
        <rect x="54" y="44" width="36" height="38" rx="2" fill="url(#ironForge)" stroke="#A5B4FC" strokeWidth="1.5" />
        {/* Tiered Chimney */}
        <rect x="72" y="24" width="12" height="22" fill="#1E1B4B" stroke="#C7D2FE" strokeWidth="1.2" />
        <ellipse cx="78" cy="24" rx="6" ry="2.5" fill="#4F46E5" stroke="#C7D2FE" strokeWidth="1" />

        {/* Billowing Blue Steam & Sparks from Chimney */}
        <circle cx="78" cy="18" r="3" fill="#BAE6FD" opacity="0.8" className="animate-ping" />
        <circle cx="82" cy="12" r="4" fill="#7DD3FC" opacity="0.6" />

        {/* Furnace Firebox Grate with Sapphire/Cyan Blue Flame */}
        <rect x="62" y="64" width="20" height="14" rx="2" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.2" />
        <polygon points="66,74 70,66 74,72 78,65 80,74" fill="#38BDF8" className="animate-pulse" />
        <circle cx="72" cy="70" r="3" fill="#E0F2FE" />

        {/* Interlocking Rotating Clockwork Brass Gears */}
        {/* Large Primary Gear */}
        <g transform="translate(48, 42)">
          <circle cx="0" cy="0" r="14" fill="none" stroke="url(#brassGear)" strokeWidth="3" strokeDasharray="4 3" className="animate-spin-slow" />
          <circle cx="0" cy="0" r="4" fill="#B45309" />
        </g>
        {/* Medium Interlocked Gear */}
        <g transform="translate(100, 52)">
          <circle cx="0" cy="0" r="10" fill="none" stroke="url(#brassGear)" strokeWidth="2.5" strokeDasharray="3 3" className="animate-spin-slow" />
          <circle cx="0" cy="0" r="3" fill="#78350F" />
        </g>

        {/* Golden Drafting Caliper / Compass Emblem */}
        <g transform="translate(64, 30)">
          <line x1="6" y1="0" x2="0" y2="12" stroke="#FEF08A" strokeWidth="1.5" />
          <line x1="6" y1="0" x2="12" y2="12" stroke="#FEF08A" strokeWidth="1.5" />
          <circle cx="6" cy="0" r="2" fill="#FEF08A" />
        </g>
      </svg>
    </div>
  );
};

/**
 * 6. GERBANG PEMBUKTIAN (2.5D / 3D Volcanic Megalith Portal of Destiny)
 * - Dark jagged volcanic basalt crag with glowing fiery magma fissures
 * - Colossal monolithic stone portal arch carved with logic runes
 * - Swirling violet cosmic aurora wormhole event horizon pulsating with starlight
 * - Electric purple plasma arcs bridging the pillars
 */
export const GerbangPembuktianSymbol3D: React.FC = () => {
  return (
    <div className="relative w-32 h-32 sm:w-38 sm:h-38 flex items-center justify-center filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.95)]">
      <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="volcanicStone" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B0764" />
            <stop offset="50%" stopColor="#2E1065" />
            <stop offset="100%" stopColor="#120324" />
          </linearGradient>
          <radialGradient id="auroraVortex" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FAF5FF" />
            <stop offset="30%" stopColor="#C084FC" />
            <stop offset="70%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#3B0764" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Jagged Volcanic Crag Island Base */}
        <polygon points="18,86 70,130 122,86 102,74 38,74" fill="url(#volcanicStone)" stroke="#A855F7" strokeWidth="1.5" />
        {/* Glowing Fiery Lava Cracks */}
        <path d="M 36 86 L 50 104 L 70 130" stroke="#F59E0B" strokeWidth="1.5" fill="none" className="animate-pulse" />
        <path d="M 104 86 L 86 106 L 70 130" stroke="#EF4444" strokeWidth="1.5" fill="none" className="animate-pulse" />

        {/* Volcanic Crag Surface */}
        <ellipse cx="70" cy="84" rx="50" ry="16" fill="#2E1065" stroke="#C084FC" strokeWidth="1.5" />

        {/* --- COLOSSAL MEGALITHIC STONE PORTAL GATEWAY --- */}
        {/* Left Stone Megalith Pillar */}
        <polygon points="34,22 48,22 50,84 32,84" fill="url(#volcanicStone)" stroke="#D8B4FE" strokeWidth="1.5" />
        {/* Runic Carvings on Left Pillar */}
        <line x1="41" y1="34" x2="41" y2="44" stroke="#C084FC" strokeWidth="1.5" />
        <circle cx="41" cy="52" r="1.5" fill="#E9D5FF" />
        <line x1="41" y1="60" x2="41" y2="70" stroke="#C084FC" strokeWidth="1.5" />

        {/* Right Stone Megalith Pillar */}
        <polygon points="92,22 106,22 108,84 90,84" fill="url(#volcanicStone)" stroke="#D8B4FE" strokeWidth="1.5" />
        {/* Runic Carvings on Right Pillar */}
        <line x1="99" y1="34" x2="99" y2="44" stroke="#C084FC" strokeWidth="1.5" />
        <circle cx="99" cy="52" r="1.5" fill="#E9D5FF" />
        <line x1="99" y1="60" x2="99" y2="70" stroke="#C084FC" strokeWidth="1.5" />

        {/* Massive Arch Lintel Stone */}
        <polygon points="26,22 70,8 114,22 104,30 70,18 36,30" fill="#581C87" stroke="#F3E8FF" strokeWidth="1.8" />
        {/* Master Keystone Rune */}
        <polygon points="70,10 74,18 70,24 66,18" fill="#F3E8FF" className="animate-pulse" />

        {/* --- SWIRLING COSMIC AURORA PORTAL VORTEX --- */}
        <ellipse cx="70" cy="54" rx="20" ry="26" fill="url(#auroraVortex)" className="animate-pulse" />
        {/* Swirling Nebula Rings */}
        <ellipse cx="70" cy="54" rx="14" ry="20" fill="none" stroke="#F5D0FE" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin-slow" />
        {/* Blinding Event Horizon Core */}
        <circle cx="70" cy="54" r="6" fill="#FFFFFF" className="animate-ping" />

        {/* Electric Purple Lightning Plasma Arcs */}
        <path d="M 48 38 L 56 46 L 52 54 L 62 54" stroke="#F3E8FF" strokeWidth="1.2" fill="none" opacity="0.9" />
        <path d="M 92 38 L 84 46 L 88 54 L 78 54" stroke="#F3E8FF" strokeWidth="1.2" fill="none" opacity="0.9" />
      </svg>
    </div>
  );
};
