import { Language, ParticipantGroup } from "../types/enums";

export const DEMOGRAPHICS_DATA = {
  [Language.TR]: {
    consent: {
      [ParticipantGroup.STANDARD]:
        "Bu çalışmaya katıldığınız için teşekkür ederiz. Çalışmaya katılım tamamen gönüllüdür. Çalışmayı dilediğiniz zaman sonlandırabilir, dilediğiniz soruyu yanıtlamamayı tercih edebilirsiniz; bunun için herhangi bir gerekçe göstermeniz gerekmez ve sizin için hiçbir olumsuz sonuç doğurmaz. <br><br> Bu anket yalnızca temel demografik bilgiler toplamaktadır. Yanıtlarınız yalnızca bilimsel amaçlarla toplanacak ve analiz edilecektir. Verileriniz güvenli bir şekilde saklanacak, gizli tutulacak ve yürürlükteki veri koruma düzenlemelerine uygun olarak işlenecektir. Verileriniz anonimleştirildikten sonra artık kişisel olarak sizinle ilişkilendirilemez. Verilere yalnızca araştırma ekibi erişebilecektir. <br><br> Çalışmaya katılma ve verilerinizin kullanılmasına ilişkin onayınızı dilediğiniz zaman geri çekebilirsiniz. Bu durumda verilerinizin silinmesini ve sonraki analizlerde kullanılmamasını talep edebilirsiniz. <br><br> Çalışma hakkında sorularınız varsa lütfen şu kişiyle iletişime geçin: <br> İlkim Koç, Dilbilim Bölümü, Konstanz Üniversitesi, ilkim.koc@uni-konstanz.de <br><br> Katılımcı olarak haklarınızla ilgili endişeleriniz varsa Konstanz Üniversitesi Etik Kurulu (Ethik-Kommission der Universität Konstanz) ile iletişime geçebilirsiniz: <br> Universitätsstraße 10, 78464 Konstanz, Almanya, Tel.: +49 7531 88-5037, Faks: +49 7531 88-5039. Daha fazla bilgi için Etik Kurulu’nun web sayfasına bakabilirsiniz.",
      [ParticipantGroup.HERITAGE]:
        "Bu çalışmaya katıldığınız için teşekkür ederiz. Çalışmaya katılım tamamen gönüllüdür. Çalışmayı dilediğiniz zaman sonlandırabilir, dilediğiniz soruyu yanıtlamamayı tercih edebilirsiniz; bunun için herhangi bir gerekçe göstermeniz gerekmez ve sizin için hiçbir olumsuz sonuç doğurmaz. <br><br> Bu anket yalnızca temel demografik bilgiler toplamaktadır. Yanıtlarınız yalnızca bilimsel amaçlarla toplanacak ve analiz edilecektir. Verileriniz güvenli bir şekilde saklanacak, gizli tutulacak ve yürürlükteki veri koruma düzenlemelerine uygun olarak işlenecektir. Verileriniz anonimleştirildikten sonra artık kişisel olarak sizinle ilişkilendirilemez. Verilere yalnızca araştırma ekibi erişebilecektir. <br><br> Çalışmaya katılma ve verilerinizin kullanılmasına ilişkin onayınızı dilediğiniz zaman geri çekebilirsiniz. Bu durumda verilerinizin silinmesini ve sonraki analizlerde kullanılmamasını talep edebilirsiniz. <br><br> Çalışma hakkında sorularınız varsa lütfen şu kişiyle iletişime geçin: <br> İlkim Koç, Dilbilim Bölümü, Konstanz Üniversitesi, ilkim.koc@uni-konstanz.de <br><br> Katılımcı olarak haklarınızla ilgili endişeleriniz varsa Konstanz Üniversitesi Etik Kurulu (Ethik-Kommission der Universität Konstanz) ile iletişime geçebilirsiniz: <br> Universitätsstraße 10, 78464 Konstanz, Almanya, Tel.: +49 7531 88-5037, Faks: +49 7531 88-5039. Daha fazla bilgi için Etik Kurulu’nun web sayfasına bakabilirsiniz.",
      checkbox:
        "Yukarıdaki bilgileri okudum ve anladım. 18 yaşından büyük olduğumu teyit ediyorum ve çalışmaya gönüllü olarak katılmayı kabul ediyorum.",
    },
    questions: {
      age: "Yaşınız kaç?",
      gender: {
        title: "Cinsiyetiniz nedir?",
        options: ["Kadın", "Erkek", "Diğer"],
      },
      mother_tongue: "Ana dil(ler)iniz hangisi/hangileri?",
      other_languages:
        "Anadil(ler)iniz dışında hangi dil(ler)i konuşuyorsunuz?",
      education: {
        title: "En yüksek tamamladığınız eğitim seviyesi nedir?",
        options: [
          "İlkokul",
          "Ortaokul",
          "Lise",
          "Ön lisans",
          "Lisans",
          "Yüksek lisans",
          "Doktora",
          "Diğer",
        ],
      },
      department: "Şu anda okuduğunuz / mezun olduğunuz bölüm nedir?",
    },
    heritage_specific: {
      born_germany: "Almanya’da mı doğdunuz?",
      born_germany_choices: ["Evet", "Hayır"],
      move_year: "Almanya’ya ne zaman taşındınız? (Yıl giriniz)",
      parents_lang: "Ebeveynlerinizin ana dilleri nelerdir?",
      helex_proficiency_title:
        "Lütfen Türkçe'de ne kadar iyi konuştuğunuzu, anladığınızı, okuduğunuzu ve yazdığınızı değerlendirin.",
      helex_questions: ["Anlama", "Konuşma", "Okuma", "Yazma"],
      helex_options: ["Çok Kötü", "Kötü", "Orta", "İyi", "Çok İyi"],
      frequency_title: "Türkçe'yi ne sıklıkta kullandığınızı değerlendirin.",
      frequency_questions: ["Duyma", "Konuşma", "Okuma", "Yazma"],
      frequency_options: [
        "(neredeyse) hiçbir zaman",
        "yılda birkaç kez",
        "ayda bir",
        "haftada bir",
        "haftada birkaç kez",
        "günde bir",
        "günde birkaç kez",
      ],
      identity_statement: "Türkçe konuşurken kendim gibi hissediyorum.",
      identity_options: [
        "Tamamen katılmıyorum",
        "Çoğunlukla katılmıyorum",
        "Biraz katılmıyorum",
        "Ne katılıyorum ne katılmıyorum",
        "Biraz katılıyorum",
        "Genel olarak katılıyorum",
        "Tamamen katılıyorum",
      ],
      visit_count_title: "Yılda kaç kez Türkiye’ye gidiyorsunuz?",
      visit_count_options: ["Asla", "Her yıl değil", "1", "2", "3", "4+"],
      visit_duration_title:
        "Türkiye’ye gittiğinizde ziyaret başına ne kadar zaman harcıyorsunuz?",
      visit_duration_options: [
        "Ziyaret etmiyorum",
        "1-2 hafta",
        "3-4 hafta",
        "1-2 ay",
        "3 ay veya daha fazla",
      ],
    },
  },
  [Language.DE]: {
    consent: {
      [ParticipantGroup.STANDARD]:
        "Vielen Dank für Ihre Teilnahme an dieser Studie. Die Teilnahme an der Studie ist vollständig freiwillig. Sie können die Studie jederzeit beenden und jede beliebige Frage unbeantwortet lassen; dafür müssen Sie keine Begründung angeben, und Ihnen entstehen daraus keinerlei Nachteile. <br><br> Dieser Fragebogen erhebt nur grundlegende demografische Angaben. Ihre Antworten werden ausschließlich zu wissenschaftlichen Zwecken erhoben und analysiert. Ihre Daten werden sicher gespeichert, vertraulich behandelt und gemäß den geltenden Datenschutzbestimmungen verarbeitet. Nach der Anonymisierung können Ihre Daten nicht mehr Ihrer Person zugeordnet werden. Auf die Daten hat ausschließlich das Forschungsteam Zugriff. <br><br> Sie können Ihre Einwilligung zur Teilnahme und zur Nutzung Ihrer Daten jederzeit widerrufen. In diesem Fall können Sie verlangen, dass Ihre Daten gelöscht und für weitere Analysen nicht verwendet werden. <br><br> Wenn Sie Fragen zu der Studie haben, wenden Sie sich bitte an: <br> İlkim Koç, Fachbereich Linguistik, Universität Konstanz, ilkim.koc@uni-konstanz.de <br><br> Wenn Sie Bedenken hinsichtlich Ihrer Rechte als Teilnehmer*in haben, können Sie sich an die Ethik-Kommission der Universität Konstanz wenden: <br> Universitätsstraße 10, 78464 Konstanz, Deutschland, Tel.: +49 7531 88-5037, Fax: +49 7531 88-5039. Weitere Informationen finden Sie auf der Webseite der Ethik-Kommission.",
      [ParticipantGroup.HERITAGE]: "",
      checkbox:
        "Ich habe die obigen Informationen gelesen und verstanden. Ich bestätige, dass ich mindestens 18 Jahre alt bin und erkläre mich freiwillig mit der Teilnahme an der Studie einverstanden.",
    },
    questions: {
      age: "Alter:",
      gender: {
        title: "Geschlecht:",
        options: ["Weiblich", "Männlich", "Sonstiges"],
      },
      mother_tongue: "Muttersprache(n):",
      other_languages: "Weitere Sprachen:",
      education: {
        title: "Höchster Bildungsabschluss:",
        options: [
          "Grundschule",
          "Haupt-/Realschule",
          "Abitur",
          "Ausbildung",
          "Bachelor",
          "Master",
          "Promotion",
          "Sonstiges",
        ],
      },
      department:
        "In welchem Fach studieren Sie oder haben Sie Ihr Studium abgeschlossen?",
    },
  },
};
