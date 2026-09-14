/* RBDigos website — foreclosed assets (properties for sale).
   Add a property by adding an entry here; no HTML editing required.
   Delete an entry once the property is sold — only properties still for sale belong in this file.

   id          URL slug — becomes property.html?id=<id>. Keep it stable once published.
   type        category, e.g. "Residential lot", "House and lot", "Agricultural lot", "Commercial lot".
               The type filter on foreclosed.html is built from these, so spell a category
               the same way on every entry.
   title       listing headline.
   location    barangay, town or city, province.
   summary     one or two sentences for the listing card and the page description.
   price       optional number in pesos, without commas or the peso sign (1250000).
               Leave it out to show "Price upon inquiry".
   lotArea     optional number, square metres of land.
   floorArea   optional number, square metres of building floor area. Leave it out for vacant lots.
   photos      optional array of { file: "lot-01.jpg", alt: "..." } — images in
               assets/images/properties/. The first photo is the listing card image.
               Filenames are case-sensitive on the server. file is a bare filename (no folders);
               entries with a path are ignored.
   body        optional array of description paragraphs:
                 { type: "p", text: "..." }
               Text is inserted with textContent, so write plain text — not HTML.
   mapEmbed    optional Google Map for the Location section. In Google Maps, find the property, then
               Share > Embed a map > Copy HTML, and paste it here. The whole <iframe ...> code or just
               its src link both work. Wrap it in single quotes ('...'), because the code contains
               double quotes. Only https://www.google.com/maps/embed links are shown.
   contact     optional { office: "...", phone: "...", email: "..." } — who handles inquiries.
               Any part left out falls back to the head office. */
window.RBD_PROPERTIES = [
  {
    id: "digos-residential-lot-sample",
    type: "Residential lot",
    title: "2-Storey Residential Building",
    location: "Brgy. Dawis, Digos City, Davao del Sur",
    summary: "",
    price: 10000000,
    lotArea: 750,
    floorArea: 355,
    photos: [
      { file: "DAWIS_ROPA.png", alt: "Front view of the lot from the road" }
    ],
    body: [
      { type: "p", text: "Great property for sale in Digos City, Davao del Sur. This 2-storey residential building is perfect for families looking for a comfortable and spacious home. With a lot area of 750 sqm and a floor area of 355 sqm, this property offers ample space for living and entertaining." }
    ],
    mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15436.64732291226!2d121.08327924941402!3d14.703438660055228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1789381651210!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
    contact: { office: "Main Branch", phone: "+082 553-3606", email: "rbdigos@rbap.org" }
  }

  /* --- Template. Copy the entry above this comment, fill it in, and remove the fields you don't need. ---

  {
    id: "digos-residential-lot-sample",
    type: "Residential lot",
    title: "Residential lot near the Digos City proper",
    location: "Brgy. Sample, Digos City, Davao del Sur",
    summary: "Titled corner lot on a concrete road, a few minutes from the public market.",
    price: 1250000,
    lotArea: 300,
    floorArea: 120,
    photos: [
      { file: "digos-lot-01.jpg", alt: "Front view of the lot from the road" },
      { file: "digos-lot-02.jpg", alt: "Rear boundary of the lot" }
    ],
    body: [
      { type: "p", text: "Describe the property here." }
    ],
    mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    contact: { office: "Main Branch", phone: "+082 553-3606", email: "rbdigos@rbap.org" }
  }

  --- */
];
