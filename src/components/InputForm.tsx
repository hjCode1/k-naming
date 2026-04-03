import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { BirthInput, CalendarType, Gender } from '../types';

interface FormValues {
  surname: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  gender: Gender;
  calendarType: CalendarType;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const SIGIN_OPTIONS = [
  { value: '-1', label: '모름' },
  { value: '0', label: '자시 (23:30~01:30)' },
  { value: '2', label: '축시 (01:30~03:30)' },
  { value: '4', label: '인시 (03:30~05:30)' },
  { value: '6', label: '묘시 (05:30~07:30)' },
  { value: '8', label: '진시 (07:30~09:30)' },
  { value: '10', label: '사시 (09:30~11:30)' },
  { value: '12', label: '오시 (11:30~13:30)' },
  { value: '14', label: '미시 (13:30~15:30)' },
  { value: '16', label: '신시 (15:30~17:30)' },
  { value: '18', label: '유시 (17:30~19:30)' },
  { value: '20', label: '술시 (19:30~21:30)' },
  { value: '22', label: '해시 (21:30~23:30)' },
];

function getDaysInMonth(year: number, month: number, isSolar: boolean): number {
  if (isSolar) {
    return new Date(year, month, 0).getDate();
  }
  return 30; // lunar months can have 29 or 30 days, use 30 as max
}

function InputForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      surname: '',
      birthYear: String(currentYear),
      birthMonth: '1',
      birthDay: '1',
      birthHour: '-1',
      gender: 'male',
      calendarType: 'solar',
    },
  });

  const watchYear = watch('birthYear');
  const watchMonth = watch('birthMonth');
  const watchCalendar = watch('calendarType');

  const maxDays = getDaysInMonth(
    Number(watchYear),
    Number(watchMonth),
    watchCalendar === 'solar',
  );
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const onSubmit = (data: FormValues) => {
    const input: BirthInput = {
      surname: data.surname,
      birthYear: Number(data.birthYear),
      birthMonth: Number(data.birthMonth),
      birthDay: Number(data.birthDay),
      birthHour: Number(data.birthHour),
      gender: data.gender,
      calendarType: data.calendarType,
    };
    navigate('/loading', { state: input });
  };

  const selectClass =
    'w-full rounded-lg border border-peach/40 bg-white px-3 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-rose/40 transition';
  const labelClass = 'block text-sm font-medium text-charcoal/70 mb-1';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 성 */}
      <div>
        <label className={labelClass}>성 (姓)</label>
        <input
          type="text"
          placeholder="예: 김"
          className={selectClass}
          {...register('surname', {
            required: '성을 입력해 주세요',
            pattern: {
              value: /^[가-힣]{1,2}$/,
              message: '한글 1~2글자로 입력해 주세요',
            },
          })}
        />
        {errors.surname && <p className={errorClass}>{errors.surname.message}</p>}
      </div>

      {/* 양력/음력 */}
      <div>
        <label className={labelClass}>역법</label>
        <div className="flex gap-3">
          {([
            ['solar', '양력'],
            ['lunar', '음력'],
            ['lunar_leap', '음력(윤달)'],
          ] as const).map(([val, label]) => (
            <label key={val} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value={val}
                className="accent-rose"
                {...register('calendarType')}
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 생년월일 */}
      <div>
        <label className={labelClass}>생년월일</label>
        <div className="grid grid-cols-3 gap-2">
          <select className={selectClass} {...register('birthYear')}>
            {years.map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select className={selectClass} {...register('birthMonth')}>
            {months.map(m => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
          <select className={selectClass} {...register('birthDay')}>
            {days.map(d => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>
        </div>
      </div>

      {/* 태어난 시간 */}
      <div>
        <label className={labelClass}>태어난 시간</label>
        <select className={selectClass} {...register('birthHour')}>
          {SIGIN_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 성별 */}
      <div>
        <label className={labelClass}>성별</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" value="male" className="accent-rose" {...register('gender')} />
            <span className="text-sm">남아</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" value="female" className="accent-rose" {...register('gender')} />
            <span className="text-sm">여아</span>
          </label>
        </div>
      </div>

      {/* 제출 */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-[#8B6914] text-white font-semibold text-lg
                   hover:bg-[#7A5C10] active:scale-[0.98] transition-all shadow-md"
      >
        이름 분석 시작
      </button>
    </form>
  );
}

export default InputForm;
