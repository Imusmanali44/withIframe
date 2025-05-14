import { useLocalization } from "../../context/LocalizationContext";

export default function RingDetails() {
  const { t } = useLocalization();
  
  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full bg-white ring-detail-table">
        <tbody>
          <tr>
            <td></td>
            <td className="py-1 font-semibold uppercase">{t('configurator.ringTypes.wedding')} {t('configurator.ringTypes.ringName').toLowerCase()}</td>
            <td className="py-1 font-semibold uppercase">{t('configurator.ringTypes.wedding')} {t('configurator.ringTypes.ringName').toLowerCase()}</td>
          </tr>
          <tr>
            <td className="py-1 border-b-2 border-black font-semibold">{t('configurator.details.profileAndSize')}</td>
            <td className="py-1 border-b-2 border-black">{t('configurator.ringTypes.ringName')} 1</td>
            <td className="py-1 border-b-2 border-black">{t('configurator.ringTypes.ringName')} 2</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.profile')}</td>
            <td className="py-1 border-b">P3</td>
            <td className="py-1 border-b">P3</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringWidth')}</td>
            <td className="py-1 border-b">2.00 mm</td>
            <td className="py-1 border-b">5.00 mm</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringThickness')}</td>
            <td className="py-1 border-b">1.80 mm</td>
            <td className="py-1 border-b">1.80 mm</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringSize')}</td>
            <td className="py-1 border-b">64 (Ø 20.4 mm)</td>
            <td className="py-1 border-b">56 (Ø 17.8 mm)</td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('configurator.details.preciousMetal')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.ringModel')}</td>
            <td className="py-1 border-b">{t('configurator.details.singleColor')}</td>
            <td className="py-1 border-b">{t('configurator.details.singleColor')}</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.distribution')}</td>
            <td className="py-1 border-b">{t('configurator.details.without')}</td>
            <td className="py-1 border-b">{t('configurator.details.without')}</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.cleanlinessColor')}</td>
            <td className="py-1 border-b">14 kt white gold</td>
            <td className="py-1 border-b">14 kt white gold</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.surface')}</td>
            <td className="py-1 border-b">Polished</td>
            <td className="py-1 border-b">Polished</td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('configurator.details.freeGrooves')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.choiceOfGroove')}</td>
            <td className="py-1 border-b">{t('configurator.details.without')} / Polished</td>
            <td className="py-1 border-b">{t('configurator.details.without')} / Polished</td>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.widthDepth')}</td>
            <td className="py-1 border-b">- / -</td>
            <td className="py-1 border-b">- / -</td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('configurator.details.stoneSetting')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.stoneSetting')}</td>
            <td className="py-1 border-b">
              1 x 0.015 ct. G / SI Brilliant
            </td>
            <td className="py-1 border-b">
              1 x 0.015 ct. G / SI Brilliant
            </td>
          </tr>
          <tr>
            <th className="py-1 border-b-2 border-black font-semibold text-start">{t('tabs.engraving')}</th>
            <th className="py-1 border-b-2 border-black"></th>
            <th className="py-1 border-b-2 border-black"></th>
          </tr>
          <tr>
            <td className="py-1 border-b">{t('configurator.details.specialEngravings')}</td>
            <td className="py-1 border-b">-</td>
            <td className="py-1 border-b">-</td>
          </tr>
          <tr>
            <td className="py-1 border-b-2 border-black font-semibold">{t('configurator.details.price')}</td>
            <td className="py-1 border-b-2 border-black font-semibold">287,- €</td>
            <td className="py-1 border-b-2 border-black font-semibold">716,- €</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
