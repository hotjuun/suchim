"use client";

import { useState } from "react";
import { SearchIcon, MapPinIcon, ChevronLeftIcon } from "./Icons";

const PLACE_LIST = [
  { category: "카페", places: ["스타벅스", "블루보틀", "카페 어니언", "투썸플레이스", "이디야", "할리스"] },
  { category: "지하철역", places: ["강남역", "홍대입구역", "합정역", "성수역", "을지로3가역", "신촌역", "이태원역", "잠실역", "건대입구역", "여의도역"] },
  { category: "공원", places: ["서울숲", "연트럴파크", "한강공원", "올림픽공원", "남산공원", "보라매공원"] },
  { category: "서점", places: ["교보문고", "영풍문고", "알라딘 중고서점", "아크앤북"] },
  { category: "야구장", places: ["잠실 야구장", "고척 스카이돔", "인천 SSG 랜더스필드", "대전 한화생명 이글스파크", "수원 KT 위즈파크"] },
  { category: "헬스장", places: ["피트니스 센터", "크로스핏 박스", "필라테스 스튜디오"] },
  { category: "기타", places: ["대학교 도서관", "동네 빵집", "편의점 앞", "버스 정류장"] },
];

interface Props {
  onSelect: (place: string) => void;
  onClose: () => void;
}

export default function PlaceSearchModal({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");

  const allPlaces = PLACE_LIST.flatMap((c) =>
    c.places.map((p) => ({ name: p, category: c.category }))
  );

  const filtered = query.trim()
    ? allPlaces.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.includes(query)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-3">
        <button onClick={onClose}>
          <ChevronLeftIcon className="h-5 w-5 text-primary" />
        </button>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소명 검색 (예: 강남역, 카페 어니언)"
            autoFocus
            className="w-full rounded-xl bg-surface py-3 pl-10 pr-4 text-sm text-primary outline-none placeholder:text-secondary focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* 검색 결과 */}
        {query.trim() && (
          <>
            {/* 직접 입력 옵션 */}
            <button
              onClick={() => onSelect(query.trim())}
              className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-accent-light p-4 text-left transition-all active:scale-[0.98]"
            >
              <MapPinIcon className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-semibold text-accent">
                  &ldquo;{query.trim()}&rdquo; 직접 입력
                </p>
                <p className="text-xs text-secondary">
                  원하는 장소명을 그대로 사용해요
                </p>
              </div>
            </button>

            {filtered.length > 0 && (
              <div className="space-y-1">
                {filtered.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => onSelect(p.name)}
                    className="flex w-full items-center gap-3 rounded-xl bg-white border border-border p-3.5 text-left transition-all active:bg-surface"
                  >
                    <MapPinIcon className="h-4 w-4 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-primary">{p.name}</p>
                      <p className="text-xs text-secondary">{p.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* 기본: 카테고리별 장소 */}
        {!query.trim() && (
          <>
            <p className="mb-4 mt-2 text-xs text-secondary">
              인기 장소를 선택하거나 직접 검색하세요
            </p>
            {PLACE_LIST.map((cat) => (
              <div key={cat.category} className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-primary">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.places.map((place) => (
                    <button
                      key={place}
                      onClick={() => onSelect(place)}
                      className="rounded-full border border-border-strong bg-white px-3.5 py-2 text-[13px] text-primary transition-all active:bg-surface"
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
