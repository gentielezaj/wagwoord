package me.gentielezaj.wagwoord.fragments.passwords

import androidx.fragment.app.activityViewModels
import me.gentielezaj.wagwoord.fragments.CoreFragmentList
import me.gentielezaj.wagwoord.models.entities.Password
import me.gentielezaj.wagwoord.services.entity.CoreEntityService
import me.gentielezaj.wagwoord.services.dependencyInjection.injectEntityService
class PasswordListFragment : CoreFragmentList<Password>() {

    protected override val entityService: CoreEntityService<Password> by injectEntityService<Password>()
    protected override val viewModel: PasswordViewModel by activityViewModels()

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment PasswordListFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance() = PasswordListFragment()
    }
}
