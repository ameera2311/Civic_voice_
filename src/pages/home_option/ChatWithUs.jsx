import { useEffect, useState } from "react";
import BackArrow from "../../components/BackArrow";
export default function ChatWithUs() {
  const faqs = [
    { q: "How do I submit a complaint?", a: "Go to 'Report Issue' and fill the form." },
    { q: "How can I check my report status?", a: "Go to 'My Reports' to view the status." },
    { q: "Can I upload images with my complaint?", a: "Yes, use the image upload feature." },
    { q: "How long does it take to resolve an issue?", a: "Resolution time depends on urgency and type." },
    { q: "Can I edit my report after submission?", a: "No, editing is currently not supported." },
    { q: "Is my location required?", a: "Yes, either GPS or manual location is needed." },
    { q: "Can I submit anonymously?", a: "Currently, all reports are linked to your app instance." },
    { q: "How is urgency determined?", a: "AI predicts urgency and you can adjust manually." },
    { q: "Can I see the AI predicted issue?", a: "Yes, it is displayed after prediction." },
    { q: "Who can view my reports?", a: "Only you can view your reports on your device." },
    { q: "Can I report multiple issues at once?", a: "Submit separate reports for each issue." },
    { q: "Is my data safe?", a: "All data is securely stored locally in your device." },
    { q: "Can I delete a report?", a: "Currently deletion is not supported." },
    { q: "What if GPS is not working?", a: "You can manually enter your location." },
    { q: "Can I translate my complaint?", a: "Yes, AI translates automatically." },
    { q: "Do I need internet for AI prediction?", a: "Yes, for translation and ML prediction API." },
    { q: "Can I upload multiple images?", a: "Currently, only one image per report is allowed." },
    { q: "How to contact support directly?", a: "Use this chat page for FAQs or send email." },
    { q: "What do the status labels mean?", a: "Processing = Under review, Resolved = Completed." },
    { q: "Can I sort reports by urgency?", a: "Not yet implemented." },
    { q: "Can I filter reports by type?", a: "Not yet implemented." },
    { q: "What languages are supported?", a: "Currently only English translation supported." },
    { q: "Can I save drafts?", a: "No, draft saving is not supported." },
    { q: "Does AI predict urgency accurately?", a: "It is an estimation; manual selection is possible." },
    { q: "Can I use the app offline?", a: "Some features work offline, AI prediction requires internet." },
    { q: "Can I share my report with others?", a: "No sharing feature is available yet." },
    { q: "Can I attach documents?", a: "Only image attachments are supported." },
    { q: "Will I get notifications?", a: "Currently notifications are not implemented." },
    { q: "How to reset the app?", a: "Clear app data from device settings to reset." },
  ];

  const [search, setSearch] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    setExpanded(new Array(filteredFaqs.length).fill(false));
  }, [filteredFaqs]);

  const filterFaqs = (query) => {
    setSearch(query);
    if (!query) {
      setFilteredFaqs(faqs);
    } else {
      setFilteredFaqs(
        faqs.filter((f) =>
          f.q.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const toggleExpand = (index) => {
    setExpanded((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8fbff] to-[#e6f4f4] py-12 px-6">
      <BackArrow />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-[#101585] mb-8">
          Help & FAQs
        </h1>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => filterFaqs(e.target.value)}
            placeholder="Search your question..."
            className="w-full px-5 py-4 rounded-2xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-[#008080] shadow-sm"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
              No matching questions found.
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition hover:shadow-lg"
              >
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-semibold text-[#101585]">
                    {faq.q}
                  </span>
                  <span className="text-[#008080] text-lg">
                    {expanded[index] ? "−" : "+"}
                  </span>
                </button>

                {expanded[index] && (
                  <div className="px-5 pb-5 text-gray-600 text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}