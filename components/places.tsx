import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import {
  Listbox,
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";

import "@reach/listbox/styles.css";

type PlacesProps = {
  setHouse: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setHouse }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    //Passo 2
    const results = await getGeocode({ address: val });
    //
    console.log(results);

    // Passo 3
    const { lat, lng } = await getLatLng(results[0]);
    //
    setHouse({ lat, lng });
  };

  return (
    <>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="combobox-input"
          placeholder="Pesquisar Endereço"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>

      {/*       <ListboxInput defaultValue="popeyes">
        <ListboxButton />
        <ListboxPopover>
          <ListboxList>
            <ListboxOption value="Felipe">Felipe</ListboxOption>
            <ListboxOption value="popeyes">Popeyes</ListboxOption>
          </ListboxList>
        </ListboxPopover>
      </ListboxInput> */}
    </>
  );
}
