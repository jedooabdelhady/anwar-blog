import PageShell from "@/components/PageShell";

export const metadata = { title: "عن مِنَصة عِلْم تَأوِيل الرُّؤى" };

export default function AboutPage() {
  return (
    <PageShell active="/about">
      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-pepper mb-8 text-center">
          عن مِنَصة عِلْم تَأوِيل الرُّؤى
        </h1>

        <div className="space-y-6 text-pepper/90 leading-loose text-[15.5px] sm:text-base">
          <p>
            هي مِساحة لِلْبحْث عن جُذُور العلْم الموْروث عِلْم تَأوِيل الرُّؤى، أو
            كمَا سَمَّاه الحبيب ﷺ المبشَّرات فِي قَولهِ:
          </p>

          <blockquote
            className="rounded-2xl border border-line bg-card p-5 sm:p-6 text-pepper italic leading-loose"
            style={{ borderInlineStartWidth: "4px", borderInlineStartColor: "#6B3F23" }}
          >
            « لَا يَبقَى بَعْدِي مِن النُّبوَّة شَيْء إِلَّا المبشَّرات، قَالُوا:
            يَا رَسُول اَللهِ، ومَا المبشَّرات؟ قَالَ: الرُّؤْيَا الصَّالحة،
            يَراهَا الرَّجل، أو تُرَى لَهُ. »
          </blockquote>

          <p>
            وَأُصُول التَّعْبير وأبْوَاب المخْطوطات القديمة والْكتب الحديثة، حَيْث
            سَتكُون مَرجِعًا لِلْعلْم والْمعْرفة والتَّأْصيل والتَّدْوين فِي ذَلِك.
          </p>

          <p>وَكمَا ورد عن اَلنبِي ﷺ حَيْث قَالَ:</p>

          <blockquote
            className="rounded-2xl border border-line bg-card p-5 sm:p-6 text-pepper italic leading-loose"
            style={{ borderInlineStartWidth: "4px", borderInlineStartColor: "#6B3F23" }}
          >
            « من سَتَر أَخَاه اَلمسْلِم سَتَره اَللَّه فِي الدُّنْيَا والْآخرة،
            وَمَن فَرَّج عن مُسْلِم كُربَة فرَّج اَللَّه عَنْه كُربَة مِن كُرَب يَوْم
            القيامة، وَاَللَّه فِي عَوْن العبْد مَا كان العبْد فِي عَوْن أَخيهِ. »
          </blockquote>

          <p>
            وَمِن باب «عَوْن العبْد مَا كان العبْد فِي عَوْن أخيه»، تَيسَّر لَنَا
            إِتاحة بوَّابَات لِلتَّواصل، وتَعبِير الرُّؤى، والإفادة فِي مَا جَاءَت
            بِه الرُّؤى والْمسائل الشَّرْعيَّة.
          </p>

          <p
            className="font-semibold text-pepper border-t border-line pt-6 mt-8"
            style={{ lineHeight: 2 }}
          >
            وَختامًا: جَعَلتُ مَا قَدَّمتُ عن وَالدِي وأجْدادي وموْتانَا وموْتى
            المسْلمين، وَلكُل مُؤْمِنٍ ومؤمِنة، فِي ذَلِك نَصيبًا مَكتُوبًا.
            <br />
            وَاَللَّه وَلِيُّ المحْسنين.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
