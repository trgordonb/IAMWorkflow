import { useNavigationResources, useTranslation } from 'adminjs'
import { Navigation } from '@adminjs/design-system'

const CustomSidebarResourceSection = ({ resources }) => {
    let elements = useNavigationResources(resources)
    const { translateLabel } = useTranslation()

    return (
        <Navigation
            label={translateLabel('navigation')}
            elements={elements}
        />
    )
}

export default CustomSidebarResourceSection